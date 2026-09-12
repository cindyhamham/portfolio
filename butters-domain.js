const scene = document.querySelector("#hamster-scene");
const buttersZone = document.querySelector("#butters-zone");
const butters = document.querySelector("#butters");
const reactionLayer = document.querySelector("#reaction-layer");
const snacks = document.querySelectorAll(".snack");
const starToggle = document.querySelector("#domain-stars");

let draggingButters = false;
let buttersOffsetX = 0;
let buttersOffsetY = 0;
let reactionTimer = null;
let lastInteraction = Date.now();

const zoneReactions = {
  water: ["quick drink", "water break", "back to business"],
  bed: ["checking the nest", "settling in", "nest inspection complete"],
  wheel: ["wheel shift started", "getting some miles in", "on the clock"]
};

const snackReactions = {
  worm: ["mealworm accepted", "excellent payment", "good snack"],
  strawberry: ["strawberry approved", "sweet snack", "worth the trip"],
  seed: ["seed secured", "saving this one", "solid choice"],
  cake: ["special occasion?", "cake accepted", "unexpected bonus"]
};

const nightReactions = [
  "night shift",
  "back to nocturnal business",
  "perfect wheel weather",
  "lights out, work begins"
];

const idleLines = [
  "reviewing today's notes",
  "between shifts",
  "working on a tiny side project",
  "studying... probably",
  "on break from an unspecified job"
];

const ratLines = {
  cola: [
    "what's over there?",
    "i'm just looking",
    "have you checked behind this?",
    "i could climb that"
  ],
  pepper: [
    "is that food?",
    "i'll stay here, thanks",
    "do you have snacks?",
    "this tissue would improve the nest"
  ]
};

function randomFrom(list){return list[Math.floor(Math.random()*list.length)]}

function showReaction(text){
  lastInteraction = Date.now();
  reactionLayer.innerHTML="";
  const pop=document.createElement("div");
  pop.className="reaction-pop";
  pop.textContent=text;

  const sceneRect=scene.getBoundingClientRect();
  const buttersRect=buttersZone.getBoundingClientRect();
  let x=buttersRect.left-sceneRect.left+buttersRect.width*.72;
  let y=buttersRect.top-sceneRect.top-24;

  x=Math.min(x,sceneRect.width-190);
  y=Math.max(y,8);
  pop.style.left=`${x}px`;
  pop.style.top=`${y}px`;
  reactionLayer.appendChild(pop);

  clearTimeout(reactionTimer);
  reactionTimer=setTimeout(()=>{reactionLayer.innerHTML=""},5000);
}

function centerOf(el){
  const r=el.getBoundingClientRect();
  return{x:r.left+r.width/2,y:r.top+r.height/2}
}

function insideZone(el,zone){
  const p=centerOf(el),r=zone.getBoundingClientRect();
  return p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom
}

function reactToZone(){
  const zones=[
    document.querySelector("#wheel-zone"),
    document.querySelector("#water-zone"),
    document.querySelector("#bed-zone")
  ];
  for(const zone of zones){
    if(insideZone(buttersZone,zone)){
      const type=zone.dataset.zone;
      showReaction(randomFrom(zoneReactions[type]));
      if(type==="wheel"){
        buttersZone.classList.remove("wheel-bounce");
        void buttersZone.offsetWidth;
        buttersZone.classList.add("wheel-bounce");
      }
      return;
    }
  }
  reactionLayer.innerHTML="";
}

butters.addEventListener("pointerdown",(event)=>{
  lastInteraction=Date.now();
  draggingButters=true;
  butters.classList.add("dragging");
  butters.setPointerCapture(event.pointerId);
  const rect=buttersZone.getBoundingClientRect();
  buttersOffsetX=event.clientX-rect.left;
  buttersOffsetY=event.clientY-rect.top;
});

butters.addEventListener("pointermove",(event)=>{
  if(!draggingButters)return;
  const sceneRect=scene.getBoundingClientRect();
  const bRect=buttersZone.getBoundingClientRect();
  let x=event.clientX-sceneRect.left-buttersOffsetX;
  let y=event.clientY-sceneRect.top-buttersOffsetY;
  x=Math.max(0,Math.min(x,sceneRect.width-bRect.width));
  y=Math.max(0,Math.min(y,sceneRect.height-bRect.height));
  buttersZone.style.left=`${x}px`;
  buttersZone.style.top=`${y}px`;
  buttersZone.style.bottom="auto";
  buttersZone.style.transform="none";
});

butters.addEventListener("pointerup",(event)=>{
  if(!draggingButters)return;
  draggingButters=false;
  butters.classList.remove("dragging");
  butters.releasePointerCapture(event.pointerId);
  reactToZone();
});

snacks.forEach((snack)=>{
  let draggingSnack=false,snackOffsetX=0,snackOffsetY=0;
  snack.addEventListener("pointerdown",(event)=>{
    lastInteraction=Date.now();
    draggingSnack=true;
    snack.classList.add("dragging");
    snack.setPointerCapture(event.pointerId);
    const r=snack.getBoundingClientRect();
    snackOffsetX=event.clientX-r.left;
    snackOffsetY=event.clientY-r.top;
  });
  snack.addEventListener("pointermove",(event)=>{
    if(!draggingSnack)return;
    const sceneRect=scene.getBoundingClientRect();
    const sRect=snack.getBoundingClientRect();
    let x=event.clientX-sceneRect.left-snackOffsetX;
    let y=event.clientY-sceneRect.top-snackOffsetY;
    x=Math.max(0,Math.min(x,sceneRect.width-sRect.width));
    y=Math.max(0,Math.min(y,sceneRect.height-sRect.height));
    if(snack.parentElement!==scene)scene.appendChild(snack);
    snack.style.position="absolute";
    snack.style.left=`${x}px`;
    snack.style.top=`${y}px`;
    snack.style.right="auto";
    snack.style.bottom="auto";
    snack.style.transform="none";
    snack.style.zIndex="80";
  });
  snack.addEventListener("pointerup",(event)=>{
    if(!draggingSnack)return;
    draggingSnack=false;
    snack.classList.remove("dragging");
    snack.releasePointerCapture(event.pointerId);
    if(insideZone(snack,buttersZone)){
      const type=snack.dataset.snack;
      showReaction(randomFrom(snackReactions[type]));
      buttersZone.classList.remove("snack-happy");
      void buttersZone.offsetWidth;
      buttersZone.classList.add("snack-happy");
      snack.style.opacity="0";
      snack.style.pointerEvents="none";
      setTimeout(()=>snack.remove(),170);
    }
  });
});

starToggle.addEventListener("click",()=>{
  const isNight=scene.classList.toggle("night");
  starToggle.setAttribute("aria-pressed",String(isNight));
  showReaction(randomFrom(nightReactions));
});

/* Curious Cola / shy Pepper hover lines */
document.querySelectorAll(".rat-peeker").forEach((rat)=>{
  const line=rat.querySelector(".rat-line");
  const key=rat.dataset.rat;

  function refreshLine(){
    line.textContent=randomFrom(ratLines[key]);
  }

  rat.addEventListener("mouseenter",refreshLine);
  rat.addEventListener("focus",refreshLine);
});

/* Occasional idle Butters behavior. */
setInterval(()=>{
  if(Date.now()-lastInteraction<11000||draggingButters)return;
  buttersZone.classList.remove("idle-hop");
  void buttersZone.offsetWidth;
  buttersZone.classList.add("idle-hop");
  showReaction(randomFrom(idleLines));
},15000);

document.querySelectorAll(".rat-peeker").forEach((rat) => {
  rat.addEventListener("pointerup", () => {
    const key = rat.dataset.rat;
    const line = rat.querySelector(".rat-line");

    line.textContent = randomFrom(ratLines[key]);
    rat.classList.add("active");
    rat.classList.remove("tap-pop");
    void rat.offsetWidth;
    rat.classList.add("tap-pop");

    setTimeout(() => rat.classList.remove("active"), 2400);
  });
});

/* Fade out before navigating to another local page. */
document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented) return;
    event.preventDefault();
    document.body.classList.add("page-leaving");
    setTimeout(() => {
      window.location.href = link.href;
    }, 300);
  });
});
