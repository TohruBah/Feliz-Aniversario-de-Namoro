"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const base="imagens/festival-casais/";
const chars=[
["rice-shower","Rice Shower"],["mihono-bourbon","Mihono Bourbon"],["meisho-doto","Meisho Doto"],["tm-opera-o","TM Opera O"],
["agnes-tachyon","Agnes Tachyon"],["manhattan-cafe","Manhattan Cafe"],["orfevre","Orfevre"],["gentildonna","Gentildonna"]];
const couples=[
["rice-shower","mihono-bourbon","Rice × Bourbon"],["meisho-doto","tm-opera-o","Doto × Opera O"],
["agnes-tachyon","manhattan-cafe","Tachyon × Cafe"],["orfevre","gentildonna","Orfevre × Gentildonna"]];
const puzzleArts=[
"imagens/puzzle-casais/rice-bourbon.png",
"imagens/puzzle-casais/doto-opera.png",
"imagens/puzzle-casais/tachyon-cafe.png",
"imagens/puzzle-casais/orfevre-gentildonna.jpg"
];
let completed=new Set(JSON.parse(localStorage.getItem("tracenArcadeDone_v2")||"[]"));
function saveDone(id){completed.add(id);localStorage.setItem("tracenArcadeDone_v2",JSON.stringify([...completed]));updateProgress();toast("Atração concluída!")}
function updateProgress(){$("#arcadeProgress").textContent=completed.size+" / 6 atrações concluídas";$("#progressBar").style.width=(completed.size/6*100)+"%"}
function toast(t){let e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("show"),1500)}
function openScreen(id){$$(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");scrollTo(0,0)}
$$("[data-open]").forEach(b=>b.onclick=()=>openScreen(b.dataset.open));$$(".home").forEach(b=>b.onclick=()=>openScreen("hub"));
let audio=$("#audio"),playing=false;$("#sound").onclick=()=>{playing=!playing;playing?audio.play().catch(()=>{}):audio.pause();$("#sound").textContent=playing?"♫":"♪"};

// GENTILDONNA POWER CHALLENGE
let powerPos=0,powerDir=1,powerTimer=null,powerTry=0,powerScore=0,powerBest=0,powerLocked=false;
function powerLabel(d){
 if(d<=3)return ["PERFEITO",100];
 if(d<=9)return ["ÓTIMO",80];
 if(d<=18)return ["BOM",55];
 return ["ERRO",15];
}
function powerReaction(label){
 return label==="PERFEITO"?"...Impressionante.":label==="ÓTIMO"?"Uma força digna de respeito.":label==="BOM"?"Nada mal. Tente novamente.":"Isso é tudo?";
}
function startPowerMotion(){
 clearInterval(powerTimer);
 powerTimer=setInterval(()=>{
   if(powerLocked)return;
   powerPos+=powerDir*1.35;
   if(powerPos>=100){powerPos=100;powerDir=-1}
   if(powerPos<=0){powerPos=0;powerDir=1}
   $("#powerMarker").style.left=powerPos+"%";
 },16);
}
function resetPower(){
 clearInterval(powerTimer);powerPos=0;powerDir=1;powerTry=0;powerScore=0;powerBest=0;powerLocked=false;
 $("#powerTry").textContent="1/5";$("#powerScore").textContent="0";$("#powerBest").textContent="—";
 $("#powerRounds").innerHTML="";$("#powerMsg").textContent="";
 $("#powerReaction").textContent="Mostre-me a sua força.";
 $("#powerHit").disabled=false;$("#powerHit").textContent="GOLPEAR";
 $("#powerMarker").style.left="0%";startPowerMotion();
}
function hitPower(){
 if(powerLocked||powerTry>=5)return;
 powerLocked=true;
 let dist=Math.abs(powerPos-50),[label,pts]=powerLabel(dist);
 powerTry++;powerScore+=pts;powerBest=Math.max(powerBest,pts);
 $("#powerScore").textContent=powerScore;
 $("#powerBest").textContent=powerBest===100?"PERFECT":powerBest>=80?"GREAT":powerBest>=55?"GOOD":"MISS";
 $("#powerReaction").textContent=powerReaction(label);
 let r=document.createElement("i");let cls={"PERFEITO":"perfect","ÓTIMO":"great","BOM":"good","ERRO":"miss"}[label]||"miss";r.className="round "+cls;r.textContent=label;$("#powerRounds").append(r);
 $("#powerMarker").classList.add("impact");setTimeout(()=>$("#powerMarker").classList.remove("impact"),260);
 if(powerTry>=5){
   clearInterval(powerTimer);$("#powerTry").textContent="5/5";$("#powerHit").disabled=true;$("#powerHit").textContent="DESAFIO CONCLUÍDO";
   let rank=powerScore>=440?"S+":powerScore>=350?"S":powerScore>=270?"A":powerScore>=190?"B":"C";
   $("#powerMsg").textContent=`Resultado: ${powerScore}/500 • Rank ${rank}`;
   if(powerScore>=270)saveDone("power");
   return;
 }
 $("#powerTry").textContent=(powerTry+1)+"/5";
 setTimeout(()=>{powerLocked=false},520);
}
$("#powerHit").onclick=hitPower;$("#powerReset").onclick=resetPower;resetPower();

// SILHOUETTE
let silOrder=[],silN=0,silScore=0,silLock=false;
function resetSil(){silOrder=[...chars].sort(()=>Math.random()-.5);silN=silScore=0;$("#silScore").textContent=0;nextSil()}
function nextSil(){if(silN>=8){$("#silMsg").textContent=`Fim! ${silScore}/8 acertos.`;if(silScore>=5)saveDone("silhouette");return}silLock=false;$(".silStage").classList.remove("reveal");let correct=silOrder[silN];$("#silImg").src=base+correct[0]+".png";$("#silRound").textContent=(silN+1)+"/8";$("#silMsg").textContent="Quem é essa Uma Musume?";let opts=[correct,...chars.filter(x=>x[0]!==correct[0]).sort(()=>Math.random()-.5).slice(0,3)].sort(()=>Math.random()-.5),box=$("#silOptions");box.innerHTML="";opts.forEach(o=>{let b=document.createElement("button");b.textContent=o[1];b.onclick=()=>answerSil(b,o[0]===correct[0],correct[1]);box.append(b)})}
function answerSil(btn,ok,name){if(silLock)return;silLock=true;$(".silStage").classList.add("reveal");if(ok){silScore++;$("#silScore").textContent=silScore;btn.classList.add("correct");$("#silMsg").textContent="Correto! "+name}else{btn.classList.add("wrong");$("#silMsg").textContent="Era "+name;[...$("#silOptions").children].find(x=>x.textContent===name)?.classList.add("correct")}silN++;setTimeout(nextSil,1200)}
$("#silReset").onclick=resetSil;resetSil();

// CRANE
let clawX=0,clawDir=1,craneTimer,tries=10,caught=new Set();
function resetCrane(){tries=10;caught.clear();$("#tries").textContent=10;$("#prizes").textContent="0/8";$("#collection").innerHTML="";let bin=$("#prizeBin");bin.innerHTML="";chars.forEach((c,i)=>{let d=document.createElement("div");d.className="prize";d.dataset.id=c[0];d.style.left=(5+(i%4)*23)+"%";d.style.bottom=(35+Math.floor(i/4)*82)+"px";d.innerHTML=`<img src="${base+c[0]}.png">`;bin.append(d)});clearInterval(craneTimer);clawX=5;craneTimer=setInterval(()=>{clawX+=clawDir*.65;if(clawX>88||clawX<3)clawDir*=-1;$("#claw").style.left=clawX+"%"},25)}
$("#grab").onclick=()=>{if(tries<=0)return toast("Sem tentativas. Reinicie a máquina.");tries--;$("#tries").textContent=tries;let machine=$("#machine"),claw=$("#claw");claw.style.top="260px";setTimeout(()=>{let best=null,dist=99;$$(".prize:not(.caught)").forEach(p=>{let px=parseFloat(p.style.left)+4,d=Math.abs(px-clawX);if(d<dist){dist=d;best=p}});if(best&&dist<8){best.classList.add("caught");caught.add(best.dataset.id);let im=document.createElement("img");im.src=base+best.dataset.id+".png";$("#collection").append(im);$("#prizes").textContent=caught.size+"/8";toast("Chaveiro capturado!");if(caught.size>=4)saveDone("crane")}else toast("A garra não pegou nada.");claw.style.top="45px"},600)}
$("#craneReset").onclick=resetCrane;resetCrane();

// TRACEN PAIR CONNECT
const pairMap={
 "rice-shower":"mihono-bourbon","mihono-bourbon":"rice-shower",
 "meisho-doto":"tm-opera-o","tm-opera-o":"meisho-doto",
 "agnes-tachyon":"manhattan-cafe","manhattan-cafe":"agnes-tachyon",
 "orfevre":"gentildonna","gentildonna":"orfevre"
};
let pairFirst=null,pairFound=new Set(),pairErrors=0,pairStarted=0,pairClock=null,pairBusy=false;
function pairName(id){return chars.find(c=>c[0]===id)?.[1]||id}
function pairTimeText(){
 let sec=pairStarted?Math.floor((Date.now()-pairStarted)/1000):0;
 return String(Math.floor(sec/60)).padStart(2,"0")+":"+String(sec%60).padStart(2,"0");
}
function resetPair(){
 clearInterval(pairClock);pairFirst=null;pairFound=new Set();pairErrors=0;pairStarted=Date.now();pairBusy=false;
 $("#pairFound").textContent="0/4";$("#pairErrors").textContent="0";$("#pairTime").textContent="00:00";
 $("#pairMsg").textContent="Escolha a primeira personagem.";
 let order=[...chars].sort(()=>Math.random()-.5),b=$("#pairBoard");b.innerHTML="";
 order.forEach(c=>{
  let x=document.createElement("button");x.className="pairCard";x.dataset.id=c[0];
  x.innerHTML=`<div class="pairPortrait"><img src="${base+c[0]}.png"></div><b>${c[1]}</b><small>TOQUE PARA CONECTAR</small>`;
  x.onclick=()=>choosePair(x,c[0]);b.append(x);
 });
 pairClock=setInterval(()=>$("#pairTime").textContent=pairTimeText(),500);
}
function choosePair(card,id){
 if(pairBusy||pairFound.has(id))return;
 if(!pairFirst){
  pairFirst=id;card.classList.add("selected");
  $("#pairMsg").textContent=`${pairName(id)} selecionada. Encontre sua parceira.`;
  return;
 }
 if(id===pairFirst){card.classList.remove("selected");pairFirst=null;$("#pairMsg").textContent="Seleção cancelada.";return}
 let first=pairFirst,firstCard=$(`.pairCard[data-id="${first}"]`);
 pairBusy=true;
 if(pairMap[first]===id){
   pairFound.add(first);pairFound.add(id);firstCard.classList.remove("selected");firstCard.classList.add("matched");card.classList.add("matched");
   let count=pairFound.size/2;$("#pairFound").textContent=count+"/4";
   $("#pairMsg").textContent=`Conexão encontrada: ${pairName(first)} × ${pairName(id)}.`;
   pairFirst=null;pairBusy=false;
   if(count===4){
     clearInterval(pairClock);$("#pairTime").textContent=pairTimeText();
     let rank=pairErrors===0?"S+":pairErrors<=2?"S":pairErrors<=5?"A":"B";
     $("#pairMsg").textContent=`Todos os casais conectados! • ${pairErrors} erro(s) • Rank ${rank}`;
     saveDone("pairconnect");
   }
 }else{
   pairErrors++;$("#pairErrors").textContent=pairErrors;firstCard.classList.add("wrong");card.classList.add("wrong");
   $("#pairMsg").textContent="Essas duas não formam um casal. Tente novamente.";
   setTimeout(()=>{firstCard.classList.remove("selected","wrong");card.classList.remove("wrong");pairFirst=null;pairBusy=false},650);
 }
}
$("#pairReset").onclick=resetPair;resetPair();

// TIC TAC TOE
let playerChar=chars[0],cpuChar=chars[1],ttt=Array(9).fill(""),turn=true,tttOver=false;
function initPicker(){let p=$("#tttChars");chars.forEach(c=>{let b=document.createElement("button");b.textContent=c[1];b.onclick=()=>{playerChar=c;cpuChar=chars.filter(x=>x[0]!==c[0])[Math.floor(Math.random()*7)];$$("#tttChars button").forEach(x=>x.classList.remove("active"));b.classList.add("active");resetTTT()};p.append(b)});p.firstChild.classList.add("active")}
const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function winner(s){return wins.find(w=>w.every(i=>ttt[i]===s))}
function resetTTT(){ttt=Array(9).fill("");turn=true;tttOver=false;$("#versus").textContent=playerChar[1]+" × "+cpuChar[1];$("#tttMsg").textContent="Sua vez";renderTTT()}
function renderTTT(){let b=$("#tttBoard");b.innerHTML="";ttt.forEach((v,i)=>{let c=document.createElement("button");c.className="tttCell";if(v)c.innerHTML=`<img src="${base+(v==="P"?playerChar[0]:cpuChar[0])}.png">`;c.onclick=()=>playTTT(i);b.append(c)})}
function playTTT(i){if(tttOver||!turn||ttt[i])return;ttt[i]="P";renderTTT();if(checkTTT("P"))return;turn=false;$("#tttMsg").textContent="CPU pensando...";setTimeout(cpuTTT,350)}
function checkTTT(s){if(winner(s)){tttOver=true;$("#tttMsg").textContent=s==="P"?"Você venceu!":"A CPU venceu.";if(s==="P")saveDone("ttt");return true}if(ttt.every(Boolean)){tttOver=true;$("#tttMsg").textContent="Empate!";return true}return false}
function cpuTTT(){let empty=ttt.map((v,i)=>v?null:i).filter(x=>x!==null),pick;for(let s of ["C","P"]){pick=empty.find(i=>{ttt[i]=s;let w=winner(s);ttt[i]="";return w});if(pick!==undefined)break}if(pick===undefined){if(!ttt[4])pick=4;else pick=empty[Math.floor(Math.random()*empty.length)]}ttt[pick]="C";renderTTT();if(!checkTTT("C")){turn=true;$("#tttMsg").textContent="Sua vez"}}
$("#tttReset").onclick=resetTTT;initPicker();resetTTT();

// MAZE
const maze=[
"111111111111111",
"100000100000001",
"101110101111101",
"101000101000101",
"101011101010101",
"100010001010001",
"111010111011101",
"100010100000001",
"101110101111101",
"101000001000001",
"101011111011101",
"101000100010001",
"101110101110101",
"100000000000001",
"111111111111111"];
let mx=1,my=1,goal={x:13,y:13};
function resetMaze(){mx=my=1;$("#mazeMsg").textContent="A presença dela está em algum lugar...";drawMaze()}
function drawMaze(){let c=$("#mazeCanvas"),x=c.getContext("2d"),s=c.width/15;x.fillStyle="#030205";x.fillRect(0,0,c.width,c.height);let grad=x.createRadialGradient((mx+.5)*s,(my+.5)*s,10,(mx+.5)*s,(my+.5)*s,s*3.2);grad.addColorStop(0,"rgba(235,220,255,.95)");grad.addColorStop(.35,"rgba(100,75,135,.45)");grad.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=grad;x.fillRect(0,0,c.width,c.height);for(let y=0;y<15;y++)for(let xx=0;xx<15;xx++)if(maze[y][xx]==="1"){let d=Math.hypot(xx-mx,y-my);if(d<3.3){x.fillStyle=`rgba(72,55,90,${Math.max(.15,1-d/4)})`;x.fillRect(xx*s,y*s,s-1,s-1)}}x.beginPath();x.arc((mx+.5)*s,(my+.5)*s,s*.18,0,Math.PI*2);x.fillStyle="#fff6c8";x.shadowBlur=18;x.shadowColor="#fff0a0";x.fill();x.shadowBlur=0;if(Math.hypot(goal.x-mx,goal.y-my)<3){let im=new Image();im.src=base+"manhattan-cafe.png";im.onload=()=>{x.globalAlpha=.75;x.drawImage(im,(goal.x-.6)*s,(goal.y-1.1)*s,s*2.2,s*2.2);x.globalAlpha=1}}}
function mazeMove(dx,dy){let nx=mx+dx,ny=my+dy;if(maze[ny]?.[nx]==="0"){mx=nx;my=ny;drawMaze();if(mx===goal.x&&my===goal.y){$("#mazeMsg").textContent="Manhattan Cafe encontrada. Experimento concluído.";saveDone("maze")}}}
$$("[data-move]").forEach(b=>b.onclick=()=>{let m={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[b.dataset.move];mazeMove(...m)});$("#mazeReset").onclick=resetMaze;document.addEventListener("keydown",e=>{if(!$("#maze").classList.contains("active"))return;let m={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[e.key];if(m){e.preventDefault();mazeMove(...m)}});resetMaze();
updateProgress();