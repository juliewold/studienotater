import { getNoteImagePath, noteImageReference } from "../../../services/media/privateStorage";
import type { Editor } from '@tiptap/core';
import { closeHistory } from '@tiptap/pm/history';
import { supabase } from '../../../lib/supabase';

const imageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export async function storeNoteImage(file: File): Promise<{ url: string; path: string }> {
  if (!imageTypes.includes(file.type)) throw Error('Bruk PNG, JPEG, WebP eller GIF.');
  if (file.size > 10 * 1024 * 1024) throw Error('Hvert bilde må være under 10 MB.');
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw Error('Du må være logget inn for å laste opp bilder.');
  const path = `${user.id}/${crypto.randomUUID()}.${file.type.split('/')[1]}`;
  const bucket = supabase.storage.from('note-images');
  const result = await bucket.upload(path, file, { contentType: file.type, cacheControl: '3600', upsert: false });
  if (result.error) throw result.error;
  return { path, url: noteImageReference(path) };
}

/** Convert only source-backed mathematics; never infer LaTeX from rendered glyphs. */
export function normalizeImportHtml(html: string): Document {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach(el => el.remove());
  doc.querySelectorAll('*').forEach(el => {
    for (const attr of Array.from(el.attributes)) {
      if (/^on/i.test(attr.name) || ['style', 'srcset'].includes(attr.name)) el.removeAttribute(attr.name);
    }
    if (el.hasAttribute('href') && !/^(https?:|mailto:|#)/i.test(el.getAttribute('href')!)) el.removeAttribute('href');
  });
  doc.querySelectorAll('annotation[encoding="application/x-tex"]').forEach(annotation => {
    const container = annotation.closest('.katex-display') ?? annotation.closest('.katex') ?? annotation.closest('math');
    if (!container) return;
    const block = container.classList.contains('katex-display') || container.getAttribute('display') === 'block';
    const math = doc.createElement(block ? 'div' : 'span');
    math.setAttribute('data-type', block ? 'block-math' : 'inline-math');
    math.setAttribute('data-latex', annotation.textContent ?? '');
    container.replaceWith(math);
  });
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);
  for (const text of texts) {
    if (text.parentElement?.closest('pre,code,[data-latex]')) continue;
    const regex = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$\$([\s\S]*?)\$\$/g;
    const value = text.data;
    const fragment = doc.createDocumentFragment();
    let end = 0;
    for (const match of value.matchAll(regex)) {
      fragment.append(value.slice(end, match.index));
      const block = match[2] === undefined;
      const math = doc.createElement(block ? 'div' : 'span');
      math.setAttribute('data-type', block ? 'block-math' : 'inline-math');
      math.setAttribute('data-latex', match[1] ?? match[2] ?? match[3]);
      fragment.append(math);
      end = match.index! + match[0].length;
    }
    if (end) { fragment.append(value.slice(end)); text.replaceWith(fragment); }
  }
  return doc;
}

export async function prepareNoteImport(html: string, files: File[], upload: (file: File) => Promise<string>): Promise<string> {
  const doc = normalizeImportHtml(html);
  const images = Array.from(doc.querySelectorAll('img'));
  const pending: Array<{ image: HTMLImageElement; file: File }> = [];
  for (const image of images) {
    const src = image.getAttribute('src') ?? '';
    const storedPath = getNoteImagePath(src);
    if (storedPath) { image.setAttribute('src', noteImageReference(storedPath)); continue; }
    if (!src.startsWith('data:image/')) {
      // A clipboard file can identify one image unambiguously, but never guess multiple positions.
      if (images.length === 1 && files.length === 1) pending.push({ image, file: files[0] });
      else throw Error('Bildedata mangler. Bruk HTML med innebygde bilder (data-URL) eller DOCX. Ingen innhold er satt inn.');
    } else {
      const blob = await (await fetch(src)).blob();
      pending.push({ image, file: new File([blob], image.alt || 'importert-bilde', { type: blob.type }) });
    }
  }
  if (!images.length) for (const file of files) {
    const image = doc.createElement('img');
    image.alt = file.name;
    doc.body.append(image);
    pending.push({ image, file });
  }
  if (pending.reduce((sum, item) => sum + item.file.size, 0) > 30 * 1024 * 1024) throw Error('Bildene må samlet være under 30 MB.');
  for (const { file } of pending) {
    if (!imageTypes.includes(file.type) || file.size > 10 * 1024 * 1024) throw Error('Bilder må være PNG/JPEG/WebP/GIF og under 10 MB.');
  }
  for (const { image, file } of pending) image.src = await upload(file);
  return doc.body.innerHTML;
}

export async function readImportFile(file: File): Promise<string> {
  if (file.size > 30 * 1024 * 1024) throw Error('Importfilen må være under 30 MB.');
  if (/\.html?$/i.test(file.name)) return file.text();
  if (!/\.docx$/i.test(file.name)) throw Error('Velg en HTML- eller DOCX-fil.');
  const mammoth = await import('mammoth');
  const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() }, {
    styleMap: ["p[style-name='Code'] => pre:separator('\\n')", "p[style-name='Source Code'] => pre:separator('\\n')"],
  });
  if (result.messages.length) throw Error(`DOCX inneholder elementer som ikke kan importeres sikkert: ${result.messages.map(m => m.message).join('; ')}. Bruk HTML med LaTeX-kilde i stedet.`);
  return result.value;
}

/** Keep the original selection stable while uploads run; one insertion/undo step. */
export async function importIntoEditor(editor: Editor, load: () => Promise<string>, files: File[] = [], upload = storeNoteImage): Promise<void> {
  if (!editor.isEditable) throw Error('Vent til pågående import er ferdig.');
  const selection = { from: editor.state.selection.from, to: editor.state.selection.to };
  const original = editor.state.doc;
  const uploaded: string[] = [];
  editor.setEditable(false);
  try {
    const html = await prepareNoteImport(await load(), files, async file => {
      const result = await upload(file); uploaded.push(result.path); return result.url;
    });
    if (editor.isDestroyed || !editor.state.doc.eq(original)) throw Error('Notatet ble endret under import. Prøv igjen.');
    editor.view.dispatch(closeHistory(editor.state.tr));
    if (!editor.commands.insertContentAt(selection, html)) throw Error('Innholdet kunne ikke settes inn.');
    editor.view.dispatch(closeHistory(editor.state.tr));
  } catch (error) {
    if (uploaded.length) await supabase.storage.from('note-images').remove(uploaded);
    throw error;
  } finally { if (!editor.isDestroyed) editor.setEditable(true); }
}
