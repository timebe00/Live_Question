const tbody = document.getElementById('masterRows');
function renderMasters(){
  document.getElementById('totalMasters').textContent = state.masters.length;
  document.getElementById('totalQuestions').textContent = Object.values(state.questions).reduce((a,b)=>a+b.length,0);
  document.getElementById('totalResponses').textContent = Object.values(state.responses).reduce((a,b)=>a+b.length,0);
  tbody.innerHTML = state.masters.map(m=>{
    const count = getQuestions(m.id).length;
    return `<tr class="clickable" onclick="go('present.html?master=${m.id}&q=0')">
      <td><strong>${escapeHtml(m.title)}</strong><br><span style="color:var(--muted)">${escapeHtml(m.description)}</span></td>
      <td><span class="badge blue">${count}개 문제</span></td>
      <td>${m.createdAt}</td>
      <td onclick="event.stopPropagation()"><div class="row-actions">
        <button class="btn ghost" onclick="go('questions.html?master=${m.id}')">문제 생성</button>
        <button class="btn danger" onclick="resetAnswers('${m.id}')">답안 초기화</button>
        <button class="btn ghost" onclick="editMaster('${m.id}')">수정</button>
        <button class="btn danger" onclick="deleteMaster('${m.id}')">삭제</button>
      </div></td>
    </tr>`;
  }).join('');
}
function resetAnswers(masterId){
  if(!confirm('해당 문제 마스터의 모든 답안을 초기화할까요?')) return;
  getQuestions(masterId).forEach(q=>state.responses[q.id]=[]);
  saveState();renderMasters();
}
function deleteMaster(id){
  if(!confirm('문제 마스터와 하위 문제를 삭제할까요?')) return;
  state.masters = state.masters.filter(m=>m.id!==id);
  delete state.questions[id];
  saveState();renderMasters();
}
function editMaster(id){
  const m=getMaster(id);
  document.getElementById('masterId').value=m.id;
  document.getElementById('masterTitle').value=m.title;
  document.getElementById('masterDesc').value=m.description;
  openModal('masterModal');
}
document.getElementById('newMasterBtn').onclick=()=>{
  document.getElementById('masterId').value='';
  document.getElementById('masterTitle').value='';
  document.getElementById('masterDesc').value='';
  openModal('masterModal');
};
document.getElementById('masterForm').addEventListener('submit',e=>{
  e.preventDefault();
  const id=document.getElementById('masterId').value;
  if(id){
    const m=getMaster(id);m.title=masterTitle.value;m.description=masterDesc.value;
  }else{
    const newId=uid('m');
    state.masters.unshift({id:newId,title:masterTitle.value,description:masterDesc.value,createdAt:new Date().toISOString().slice(0,10)});
    state.questions[newId]=[];
  }
  saveState();closeModal('masterModal');renderMasters();
});
renderMasters();
