import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

// Loads the TypeScript module directly, without a browser.
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith('.')) {
      const url = new URL(`${specifier}.ts`, context.parentURL);
      if (existsSync(url)) return next(url.href, context);
    }
    return next(specifier, context);
  },
});

const { placeExamMarkPopover, POPOVER_MAX_WIDTH, POPOVER_EDGE_MARGIN } = await import(
  '../src/components/notes/NoteEditor/examMarkPopoverPlacement.ts'
);

const viewport = { width: 1000, height: 800 };
const size = { width: 300, height: 120 };

const line = (left, top, width = 40, height = 20) => ({ left, top, right: left + width, bottom: top + height });

function inside(p, w = size.width, h = size.height, vp = viewport) {
  assert.ok(p.left >= POPOVER_EDGE_MARGIN, `venstre kant utenfor: ${p.left}`);
  assert.ok(p.left + p.width <= vp.width - POPOVER_EDGE_MARGIN, `høyre kant utenfor: ${p.left + p.width}`);
  assert.ok(p.top >= POPOVER_EDGE_MARGIN, `topp utenfor: ${p.top}`);
  assert.ok(p.top + Math.min(h, p.maxHeight) <= vp.height - POPOVER_EDGE_MARGIN + 0.5, `bunn utenfor: ${p.top}`);
}

test('places the popover above the mark when there is room', () => {
  const p = placeExamMarkPopover({ firstLine: line(400, 400), lastLine: line(400, 400), size, viewport });
  assert.equal(p.side, 'above');
  assert.equal(p.left, 400);
  assert.ok(p.top + size.height <= 400);
  inside(p);
});

test('places the popover below when there is no room above', () => {
  const p = placeExamMarkPopover({ firstLine: line(400, 20), lastLine: line(400, 20), size, viewport });
  assert.equal(p.side, 'below');
  assert.ok(p.top >= 20 + 20);
  inside(p);
});

test('moves the popover left when the mark is near the right edge', () => {
  const p = placeExamMarkPopover({ firstLine: line(960, 400), lastLine: line(960, 400), size, viewport });
  assert.equal(p.left, viewport.width - POPOVER_EDGE_MARGIN - p.width);
  inside(p);
});

test('keeps the popover on screen for a mark at the left edge', () => {
  const p = placeExamMarkPopover({ firstLine: line(0, 400), lastLine: line(0, 400), size, viewport });
  assert.equal(p.left, POPOVER_EDGE_MARGIN);
  inside(p);
});

test('caps the width and lets long text wrap inside the popover', () => {
  const p = placeExamMarkPopover({ firstLine: line(100, 400), lastLine: line(100, 400), size: { width: 900, height: 400 }, viewport });
  assert.equal(p.width, POPOVER_MAX_WIDTH);
  inside(p, 900, 400);
});

test('narrow phone screens use the available width', () => {
  const phone = { width: 300, height: 812 };
  const p = placeExamMarkPopover({ firstLine: line(300, 400), lastLine: line(300, 400), size, viewport: phone });
  assert.equal(p.width, phone.width - POPOVER_EDGE_MARGIN * 2);
  assert.equal(p.left, POPOVER_EDGE_MARGIN);
  inside(p, size.width, size.height, phone);
});

test('multi-line marks use the first line above and the last line below', () => {
  const first = line(100, 300);
  const last = line(50, 500);
  const above = placeExamMarkPopover({ firstLine: first, lastLine: last, size, viewport });
  assert.equal(above.side, 'above');
  assert.ok(above.top + size.height <= first.top);
  const low = placeExamMarkPopover({ firstLine: line(100, 20), lastLine: line(50, 760), size, viewport });
  assert.equal(low.side, 'above');
  inside(low);
});
