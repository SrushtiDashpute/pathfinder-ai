const $=s=>document.querySelector(s);
function setResult(id,text){const el=document.getElementById(id);if(el){el.textContent=text;el.style.display="block"}}
async function askAI(message,context="",target="aiResult"){
  setResult(target,"Thinking...");
  try{
    const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message,context})});
    const d=await r.json(); setResult(target,d.answer||d.error||"No answer.");
  }catch(e){setResult(target,"Could not connect to the backend. Start Flask with: python app.py");}
}
function saveProfile(){
  const p={name:$("#name")?.value||"",year:$("#year")?.value||"",goal:$("#goal")?.value||"",skills:$("#skills")?.value||""};
  localStorage.setItem("pathfinderProfile",JSON.stringify(p)); alert("Profile saved!");
}
function loadProfile(){
  const p=JSON.parse(localStorage.getItem("pathfinderProfile")||"{}");
  ["name","year","goal","skills"].forEach(k=>{if($("#"+k)&&p[k])$("#"+k).value=p[k]});
}
function runQuiz(){
  let score={Technology:0,Medicine:0,Business:0,Design:0,Law:0};
  document.querySelectorAll("[data-career]:checked").forEach(x=>score[x.dataset.career]+=Number(x.value));
  const best=Object.entries(score).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const text="Top career areas:\\n"+best.map((x,i)=>`${i+1}. ${x[0]} — ${x[1]} points`).join("\\n")+
    "\\n\\nNext step: open Explore Careers and Career Roadmap to compare requirements and build your plan.";
  setResult("quizResult",text); localStorage.setItem("quizResult",JSON.stringify(best));
}
function skillGap(){
  const target=$("#targetCareer").value, skills=($("#currentSkills").value||"").toLowerCase().split(",").map(x=>x.trim()).filter(Boolean);
  const required={
    "Software Developer":["programming","data structures","git","web development","databases"],
    "Data Analyst":["python","excel","sql","statistics","data visualization"],
    "UI/UX Designer":["figma","ui design","ux research","prototyping","design systems"],
    "Doctor":["biology","chemistry","physics","medical entrance preparation"],
    "Digital Marketer":["seo","content","analytics","social media","copywriting"]
  }[target]||["communication","problem solving","domain knowledge","digital skills"];
  const missing=required.filter(x=>!skills.some(s=>s.includes(x)||x.includes(s)));
  setResult("gapResult",`Target: ${target}\\n\\nSkills to develop:\\n${missing.length?missing.map(x=>"• "+x).join("\\n"):"Great — your listed skills cover the starter requirements."}\\n\\nTip: add projects and evidence for each skill.`);
}
function interview(){
  const role=$("#role").value; const level=$("#level").value;
  const qs=[`Tell me about yourself for a ${role} role.`,`Why do you want to work as a ${role}?`,`Describe one project related to ${role}.`,`What is one technical skill you are improving?`,`Tell me about a problem you solved.`,`Why should we select you as a ${level} candidate?`];
  setResult("interviewResult",qs.map((q,i)=>`${i+1}. ${q}`).join("\\n\\n"));
}
document.addEventListener("DOMContentLoaded",loadProfile);
