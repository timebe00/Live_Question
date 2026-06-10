const masterId=qs('master')||state.masters[0].id;
const index=currentIndex(masterId);
const q=getQuestion(masterId,index);
if(!q){document.body.innerHTML='<div class="complete"><div><h1>문제가 없습니다.</h1></div></div>'}
else{
  solveQuestion.textContent=q.text;
  solveOptions.innerHTML=q.options.map((op,i)=>`<label class="choice"><input type="radio" name="answer" value="${i+1}"><span><b>${i+1}</b> ${escapeHtml(op)}</span></label>`).join('');
}
solveForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const checked=document.querySelector('input[name="answer"]:checked');
  if(!checked){alert('답안을 선택해주세요.');return;}
  state.responses[q.id]=state.responses[q.id]||[];
  state.responses[q.id].push(Number(checked.value));
  saveState();
  location.href='submitted.html';
});
