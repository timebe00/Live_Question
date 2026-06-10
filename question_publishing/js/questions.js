const masterId = qs('master') || state.masters[0].id;
const master = getMaster(masterId);
let selected = 0;
document.getElementById('masterName').textContent = master.title;
function renderQuestionList(){
  const list=document.getElementById('questionList');
  const questions=getQuestions(masterId);
  list.innerHTML=questions.map((q,i)=>`<div class="q-list-item ${i===selected?'active':''}" draggable="true" data-index="${i}" onclick="selectQuestion(${i})"><span><span class="drag-handle">☰</span> ${i+1}. ${escapeHtml(q.text||'새 문제')}</span><span class="badge">${q.options.length}지선다</span></div>`).join('') || '<div class="subtitle">아직 문제가 없습니다. 새 문제를 추가하세요.</div>';
  addDragEvents();
}
function renderEditor(){
  const questions=getQuestions(masterId);
  const q=questions[selected];
  document.getElementById('editorEmpty').style.display=q?'none':'block';
  document.getElementById('editorForm').style.display=q?'block':'none';
  if(!q) return;
  questionText.value=q.text;
  correctAnswer.value=q.answer;
  renderOptions(q);
}
function renderOptions(q){
  optionRows.innerHTML=q.options.map((op,i)=>`<div class="option-row"><div class="option-no">${i+1}</div><input value="${escapeHtml(op)}" oninput="updateOption(${i},this.value)"><select onchange="setAnswer(${i+1})"><option ${q.answer===i+1?'selected':''}>정답</option></select><button type="button" class="mini-btn" onclick="removeOption(${i})">×</button></div>`).join('');
}
function selectQuestion(i){selected=i;renderQuestionList();renderEditor();}
function updateOption(i,val){getQuestions(masterId)[selected].options[i]=val;saveState();}
function setAnswer(n){getQuestions(masterId)[selected].answer=n;correctAnswer.value=n;saveState();renderEditor();}
function removeOption(i){const q=getQuestions(masterId)[selected]; if(q.options.length<=2){alert('최소 2개 문항은 필요합니다.');return;} q.options.splice(i,1); if(q.answer>q.options.length) q.answer=q.options.length; saveState();renderEditor();renderQuestionList();}
addQuestionBtn.onclick=()=>{getQuestions(masterId).push({id:uid('q'),text:'',answer:1,options:['','','','']});selected=getQuestions(masterId).length-1;saveState();renderQuestionList();renderEditor();};
deleteQuestionBtn.onclick=()=>{if(!confirm('현재 문제를 삭제할까요?'))return;getQuestions(masterId).splice(selected,1);selected=Math.max(0,selected-1);saveState();renderQuestionList();renderEditor();};
addOptionBtn.onclick=()=>{const q=getQuestions(masterId)[selected];q.options.push('');saveState();renderEditor();renderQuestionList();};
editorForm.addEventListener('submit',e=>{e.preventDefault();const q=getQuestions(masterId)[selected];q.text=questionText.value;q.answer=Number(correctAnswer.value);saveState();renderQuestionList();alert('저장되었습니다.');});
function addDragEvents(){
  let from;
  document.querySelectorAll('.q-list-item').forEach(el=>{
    el.ondragstart=()=>{from=Number(el.dataset.index);el.classList.add('sortable-ghost')};
    el.ondragend=()=>el.classList.remove('sortable-ghost');
    el.ondragover=e=>e.preventDefault();
    el.ondrop=()=>{const to=Number(el.dataset.index);const arr=getQuestions(masterId);const [moved]=arr.splice(from,1);arr.splice(to,0,moved);selected=to;saveState();renderQuestionList();renderEditor();};
  });
}
renderQuestionList();renderEditor();
