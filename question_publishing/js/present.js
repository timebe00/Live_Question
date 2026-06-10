const masterId = qs('master') || state.masters[0].id;
const index = currentIndex(masterId);
const master = getMaster(masterId);
const question = getQuestion(masterId,index);
document.getElementById('masterName').textContent = master.title;
function renderPresent(){
  if(!question){document.getElementById('stage').innerHTML='<div class="card-pad"><h1 class="title">문제가 없습니다.</h1></div>';return;}
  qCount.textContent=`${index+1} / ${getQuestions(masterId).length}`;
  qTitle.textContent=question.text;
  options.innerHTML=question.options.map((op,i)=>`<div class="answer-item"><div class="answer-index">${i+1}</div><div class="answer-text">${escapeHtml(op)}</div></div>`).join('');
  prevBtn.onclick=()=>go(`present.html?master=${masterId}&q=${Math.max(0,index-1)}`);
  nextBtn.onclick=()=>go(`present.html?master=${masterId}&q=${Math.min(getQuestions(masterId).length-1,index+1)}`);
  resultBtn.onclick=()=>go(`results.html?master=${masterId}&q=${index}`);
  qrBtn.onclick=()=>{drawQR();openModal('qrModal')};
}
function drawQR(){
  const canvas=document.getElementById('qrCanvas');const ctx=canvas.getContext('2d');const size=21;const cell=canvas.width/size;ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#111827';
  const seed=(question.id+masterId).split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  for(let y=0;y<size;y++){for(let x=0;x<size;x++){if((x<7&&y<7)||(x>13&&y<7)||(x<7&&y>13)||((x*y+seed+x+y)%5===0)){ctx.fillRect(x*cell,y*cell,cell,cell)}}}
  qrLink.textContent=`solve.html?master=${masterId}&q=${index}`;
}
renderPresent();
