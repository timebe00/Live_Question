const masterId=qs('master')||state.masters[0].id;
const index=currentIndex(masterId);
const q=getQuestion(masterId,index);
document.getElementById('masterName').textContent=getMaster(masterId).title;
function renderResults(){
  if(!q){resultArea.innerHTML='<h1 class="title">문제가 없습니다.</h1>';return;}
  resultCount.textContent=`${index+1} / ${getQuestions(masterId).length}`;
  resultQuestion.textContent=q.text;
  const responses=state.responses[q.id]||[];
  const total=responses.length || 0;
  resultTotal.textContent=`총 ${total}명 참여`;
  resultRows.innerHTML=q.options.map((op,i)=>{
    const count=responses.filter(v=>v===i+1).length;
    const pct=total?Math.round(count/total*100):0;
    return `<div class="result-row"><div class="result-no">${i+1}</div><div><div class="result-label">${escapeHtml(op)}</div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div></div><div class="result-stat"><div class="count">${count}명</div><div class="percent">${pct}%</div></div></div>`;
  }).join('');
  answerBox.textContent=`정답: ${q.answer}번 · ${q.options[q.answer-1]}`;
  prevBtn.onclick=()=>go(`results.html?master=${masterId}&q=${Math.max(0,index-1)}`);
  nextBtn.onclick=()=>go(`results.html?master=${masterId}&q=${Math.min(getQuestions(masterId).length-1,index+1)}`);
  presentBtn.onclick=()=>go(`present.html?master=${masterId}&q=${index}`);
}
showAnswerBtn.onclick=()=>answerBox.classList.toggle('show');
setInterval(renderResults,1500);
renderResults();
