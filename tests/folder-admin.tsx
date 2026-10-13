import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../src/context/AuthContext/AuthContext';
import { FolderCard } from '../src/components/notes/FolderCard/FolderCard';
import { SortableFolders } from '../src/components/notes/SortableFolders/SortableFolders';
const folders = ['a', 'b'].map((id, i) => ({id, subjectId:'subject', name:id, createdAt:id, topicId:null, topicName:null, colorIndex:i, sortOrder:i}));
for (const isAdmin of [false, true]) {
  const element = document.createElement('div');
  element.innerHTML = renderToStaticMarkup(<AuthContext.Provider value={{ user:null, role:isAdmin ? 'admin' : 'user', isAdmin, isLoading:false, signOut:async()=>{} }}>
    <MemoryRouter><SortableFolders subjectId="subject" folders={folders} enabled={true} onReordered={()=>{}}>
      {folder=><FolderCard folder={folder} subjectId="subject" noteCount={1} onFolderUpdated={()=>{}} onFolderDeleted={()=>{}} />}
    </SortableFolders></MemoryRouter>
  </AuthContext.Provider>);
  const valid = element.querySelectorAll('.folder-card').length === 2 &&
    element.querySelectorAll('.folder-card-menu').length === (isAdmin ? 2 : 0) &&
    element.querySelectorAll('.folder-drag-handle').length === (isAdmin ? 2 : 0) &&
    element.querySelector('.notes-folder-tone-1 a')?.getAttribute('href') === '/fag/subject/notater/mappe/b';
  document.querySelector('#results')!.textContent += `${valid ? 'PASS' : 'FAIL'}: ${isAdmin ? 'Admin controls' : 'Reader links without administration'}; colors and order preserved\n`;
}
