"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const people=[
{id:"rice-shower",name:"Rice Shower"},{id:"mihono-bourbon",name:"Mihono Bourbon"},
{id:"meisho-doto",name:"Meisho Doto"},{id:"tm-opera-o",name:"TM Opera O"},
{id:"agnes-tachyon",name:"Agnes Tachyon"},{id:"manhattan-cafe",name:"Manhattan Cafe"},
{id:"orfevre",name:"Orfevre"},{id:"gentildonna",name:"Gentildonna"}];
const pairs={"rice-shower":"mihono-bourbon","mihono-bourbon":"rice-shower","meisho-doto":"tm-opera-o","tm-opera-o":"meisho-doto","agnes-tachyon":"manhattan-cafe","manhattan-cafe":"agnes-tachyon","orfevre":"gentildonna","gentildonna":"orfevre"};
const couples=[
{a:"rice-shower",b:"mihono-bourbon",title:"Rice Shower × Mihono Bourbon"},
{a:"meisho-doto",b:"tm-opera-o",title:"Meisho Doto × TM Opera O"},
{a:"agnes-tachyon",b:"manhattan-cafe",title:"Agnes Tachyon × Manhattan Cafe"},
{a:"orfevre",b:"gentildonna",title:"Orfevre × Gentildonna"}];
let first=null,second=null,lock=false,moves=0,found=0,start=0,timer=null,music=false;
let collection=new Set(JSON.parse(localStorage.getItem("tracenCouples9_v2")||"[]"));
let urUnlocked=localStorage.getItem("tracenUR9_v2")==="1";
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function fmt(s){return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function tick(){if(start)$("#time").textContent=fmt(Math.floor((Date.now()-start)/1000))}
function banner(t){let e=$("#matchBanner");e.textContent=t;e.classList.add("show");clearTimeout(banner.t);banner.t=setTimeout(()=>e.classList.remove("show"),1500)}
function coupleKey(a,b){return [a,b].sort().join("|")}
function saveCollection(){localStorage.setItem("tracenCouples9_v2",JSON.stringify([...collection]));updateAlbum()}
function showPage(id){$$(".page").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");$$(".festivalNav button[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===id));scrollTo(0,0)}
function build(){
 clearInterval(timer);first=second=null;lock=false;moves=found=0;start=0;
 $("#moves").textContent="0";$("#pairs").textContent="0 / 4";$("#time").textContent="00:00";
 let b=$("#board");b.innerHTML="";
 shuffle([...people]).forEach(p=>{let c=document.createElement("button");c.className="memory-card";c.dataset.id=p.id;c.innerHTML=`<span class="face backFace"></span><span class="face frontFace"><span class="character"><img src="imagens/festival-casais/${p.id}.png" alt="${p.name}"></span><span class="caption"><b>${p.name}</b></span></span>`;c.onclick=()=>flip(c);b.append(c)})
}
function flip(c){
 if(lock||c===first||c.classList.contains("matched"))return;
 if(!start){start=Date.now();timer=setInterval(tick,500)}
 c.classList.add("flipped");if(!first){first=c;return}
 second=c;lock=true;moves++;$("#moves").textContent=moves;
 if(pairs[first.dataset.id]===second.dataset.id){
   first.classList.add("matched");second.classList.add("matched");found++;$("#pairs").textContent=found+" / 4";
   let a=first.dataset.id,b=second.dataset.id,key=coupleKey(a,b);
   collection.add(key);saveCollection();
   let title=couples.find(x=>coupleKey(x.a,x.b)===key).title;
   coupleEffect(key,title);
   first=second=null;lock=false;
   if(found===4){clearInterval(timer);setTimeout(completeFestival,800)}
 }else setTimeout(()=>{first.classList.remove("flipped");second.classList.remove("flipped");first=second=null;lock=false},850)
}
const supportData={
"mihono-bourbon|rice-shower":{rarity:"SSR",title:"Silent Promise",effect:"soft"},
"meisho-doto|tm-opera-o":{rarity:"SSR",title:"Grand Stage",effect:"stage"},
"agnes-tachyon|manhattan-cafe":{rarity:"SSR",title:"Midnight Experiment",effect:"science"},
"gentildonna|orfevre":{rarity:"SSR",title:"Imperial Pair",effect:"imperial"}
};
let favorite=localStorage.getItem("tracenFavorite9_v2")||"";
function updateAlbum(){
 let g=$("#albumGrid");g.innerHTML="";
 couples.forEach((c,i)=>{
   let key=coupleKey(c.a,c.b),ok=collection.has(key),sup=supportData[key]||{rarity:"SSR",title:c.title,effect:"soft"};
   let d=document.createElement("article");d.className="albumCard "+(ok?"unlocked":"locked")+(favorite===key?" favorite":"");
   d.innerHTML=ok?`<div class="supportRare">${sup.rarity}</div><div class="couplePics"><img src="imagens/festival-casais/${c.a}.png"><span>×</span><img src="imagens/festival-casais/${c.b}.png"></div><small>CARTA DE SUPORTE • MEMÓRIA ${String(i+1).padStart(2,"0")}</small><h3>${sup.title}</h3><p>${c.title}</p><button class="favBtn">${favorite===key?"★ FAVORITO":"☆ FAVORITAR"}</button>`:`<div class="lockedPair">?</div><small>MEMÓRIA ${String(i+1).padStart(2,"0")}</small><h3>??? × ???</h3><p>Encontre este casal no jogo da memória.</p>`;
   if(ok)d.querySelector(".favBtn").onclick=()=>{favorite=key;localStorage.setItem("tracenFavorite9_v2",key);updateAlbum()};
   g.append(d)
 });
 $("#albumCount").textContent=collection.size+"/4";$("#collectionText").textContent=collection.size+" / 4";$("#collectionBar").style.width=(collection.size/4*100)+"%";
 $("#passportStatus").textContent=collection.size===4?"FESTIVAL COMPLETO":collection.size+" / 4 carimbos";
 if(collection.size===4){urUnlocked=true;localStorage.setItem("tracenUR9_v2","1")}
 $$("#stamps i").forEach((s,i)=>s.classList.toggle("stamped",i<collection.size || (i===4&&urUnlocked)));
 $("#urNav").disabled=!urUnlocked;$("#urNav").innerHTML=urUnlocked?"UR ✦":"UR 🔒";
}
function completeFestival(){
 updateAlbum();
 if(collection.size===4 && !sessionStorage.getItem("urShown9")){$("#unlock").classList.add("show");sessionStorage.setItem("urShown9","1")}else showPage("album")
}
$$(".festivalNav button[data-page]").forEach(b=>b.onclick=()=>{if(b.dataset.page!=="ur"||urUnlocked)showPage(b.dataset.page)});
$("#restart").onclick=build;
$("#openUR").onclick=()=>{$("#unlock").classList.remove("show");showPage("ur")};
$("#closeUnlock").onclick=()=>{$("#unlock").classList.remove("show");showPage("album")};
$("#musicBtn").onclick=()=>{music=!music;let a=$("#music");$("#musicBtn").textContent=music?"♫":"♪";music?a.play().catch(()=>{}):a.pause()};
function coupleEffect(key,title){
 const sup=supportData[key]; document.body.dataset.matchEffect=sup.effect;
 banner(sup.title+" • "+title);
 const fx=document.createElement("div");fx.className="coupleFx "+sup.effect;
 fx.innerHTML=sup.effect==="stage"?"<b>APLAUSOS FINAIS!</b>":sup.effect==="science"?"<b>EXPERIMENTO DE COMPATIBILIDADE: SUCESSO</b>":sup.effect==="imperial"?"<b>DUPLA IMPERIAL</b>":"<b>PROMESSA SILENCIOSA</b>";
 document.body.append(fx);setTimeout(()=>fx.classList.add("on"),20);setTimeout(()=>{fx.remove();delete document.body.dataset.matchEffect},1400);
}
function initUR(){
 const card=$("#urCard"),skill=$("#skillBtn");
 if(card) card.onclick=e=>{if(e.target.closest("#skillBtn"))return;card.classList.toggle("flipped")};
 if(skill) skill.onclick=e=>{e.stopPropagation();let b=$("#skillBurst");b.classList.remove("on");void b.offsetWidth;b.classList.add("on");};
}
updateAlbum();build();initUR();
// Skill UR: permanece aberta até um clique fora da área da ativação.
(function(){
  const burst=document.getElementById("skillBurst");
  if(!burst) return;
  burst.addEventListener("click",ev=>ev.stopPropagation());
  document.addEventListener("click",ev=>{
    if(!burst.classList.contains("on")) return;
    if(burst.contains(ev.target)) return;
    const trigger=ev.target.closest?.(".skillBox,.urSkill,#skillBtn");
    if(!trigger) burst.classList.remove("on");
  });
})();
