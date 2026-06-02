const firebaseConfig = {
  apiKey: "AIzaSyC4bSu52LkoUTTOY2_P3q7sQSkrus3NccA",
  authDomain: "starnote-52dab.firebaseapp.com",
  projectId: "starnote-52dab",
  storageBucket: "starnote-52dab.firebasestorage.app",
  messagingSenderId: "701812553416",
  appId: "1:701812553416:web:328c463b159a5d788617fd"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ⭐ رسائل
let stars = [];

let offsetX = 0;
let offsetY = 0;
let dragging = false;
let lx = 0;
let ly = 0;

// 🎨 رسم خفيف (مناسب للموبايل)
function draw(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let s of stars){

    let x = s.x + offsetX;
    let y = s.y + offsetY;

    ctx.fillStyle = s.color;

    ctx.beginPath();
    ctx.arc(x,y,3,0,Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

// 💾 حفظ
function saveNote(){
  let text = document.getElementById("note").value;
  if(!text) return;

  let colors = ["#fff","#ff8c00","#00f5ff","#ffd700","#a855f7"];

  db.collection("notes").add({
    text,
    color: colors[Math.floor(Math.random()*colors.length)],
    time: new Date().toLocaleString(),
    x: Math.random()*2000-1000,
    y: Math.random()*2000-1000
  });

  document.getElementById("note").value="";
}

// 📡 تحميل
db.collection("notes").onSnapshot(snap=>{
  stars=[];
  snap.forEach(d=>{
    stars.push(d.data());
  });
});

// 🧭 سحب (موبايل + كمبيوتر)
function start(x,y){
  dragging=true;
  lx=x; ly=y;
}

function move(x,y){
  if(!dragging) return;

  offsetX += x-lx;
  offsetY += y-ly;

  lx=x; ly=y;
}

function end(){
  dragging=false;
}

// 🖱️ + 📱
canvas.addEventListener("mousedown",e=>start(e.clientX,e.clientY));
canvas.addEventListener("mousemove",e=>move(e.clientX,e.clientY));
canvas.addEventListener("mouseup",end);

canvas.addEventListener("touchstart",e=>{
  let t=e.touches[0];
  start(t.clientX,t.clientY);
},{passive:true});

canvas.addEventListener("touchmove",e=>{
  let t=e.touches[0];
  move(t.clientX,t.clientY);
},{passive:true});

canvas.addEventListener("touchend",end);
