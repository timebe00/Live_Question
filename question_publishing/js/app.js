const STORAGE_KEY = 'liveQuestionDemoData';
const state = loadState();

function loadState(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved) return JSON.parse(saved);
  const seed = {
    masters:[
      {id:'m1', title:'위장관 기능검사 워크샵 퀴즈', description:'세션 중 실시간 참여용 문제', createdAt:'2026-06-10'},
      {id:'m2', title:'온라인 학술대회 사전 테스트', description:'발표 전 장비 테스트용', createdAt:'2026-06-10'}
    ],
    questions:{
      m1:[
        {id:'q1', text:'다음 중 식도이완불능증 진단에 가장 중요한 검사는?', answer:2, options:['상부위장관 내시경','고해상도 식도내압검사','복부 초음파','단순 흉부 X-ray']},
        {id:'q2', text:'수소호기검사 전 주의사항으로 가장 적절한 것은?', answer:1, options:['검사 전 금식 유지','검사 직전 과식','항생제 복용 직후 시행','운동 직후 시행']}
      ],
      m2:[
        {id:'q3', text:'실시간 투표 시스템에서 발표자가 가장 먼저 확인해야 하는 것은?', answer:3, options:['디자인 색상','문항 개수','QR 접속 여부','발표자 이름']}
      ]
    },
    responses:{q1:[2,2,1,3,2,4,2,1,2,3,2,2,1],q2:[1,1,2,1,3,1,1,4],q3:[3,3,2,3,1,3]}
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}
function saveState(){localStorage.setItem(STORAGE_KEY, JSON.stringify(state));}
function qs(name){return new URLSearchParams(location.search).get(name);}
function go(url){location.href=url;}
function uid(prefix){return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,6);}
function getMaster(id){return state.masters.find(m=>m.id===id) || state.masters[0];}
function getQuestions(masterId){return state.questions[masterId] || [];} 
function getQuestion(masterId, index){return getQuestions(masterId)[Number(index||0)] || getQuestions(masterId)[0];}
function currentIndex(masterId){const i=Number(qs('q')||0);return Math.max(0, Math.min(i, getQuestions(masterId).length-1));}
function escapeHtml(s){return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function openModal(id){document.getElementById(id)?.classList.add('open');}
function closeModal(id){document.getElementById(id)?.classList.remove('open');}
