// 🔥 Firebase
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

// 🌌 canvas
const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ⭐ النجوم
let stars = [];

// 🧭 حركة + زووم خفيف
let offsetX = 0;
let offsetY = 0;
let scale = 1;

let dragging = false;
let lastX = 0;
let lastY = 0;

// 🎯 رسم احترافي مرتب
function draw(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let s of stars){

    // تطبيق zoom + pan
    let x = (s.x * scale) + offsetX;
    let y = (s.y * scale) + offsetY;

    // حجم النجمة ثابت وواضح
    let size = 5 * scale;

    ctx.shadowBlur = 20;
    ctx.shadowColor = s.color || "#fff";

    ctx.fillStyle = s.color || "#fff";

    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI*2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(draw);
}
draw();

// 💾 حفظ رسالة (توزيع مرتب أكثر)
function saveNote(){
  let text = document.getElementById("note").value;
  if(!text) return;

  let colors = ["#fff","#ff8c00","#00f5ff","#ffd700","#a855f7","#ff4d6d"];

  db.collection("notes").add({
    text,
    color: colors[Math.floor(Math.random()*colors.length)],
    time: new Date().toLocaleString(),

    // 🌌 توزيع أوسع حتى ما تتكدس
    x: (Math.random()-0.5) * 3000,
    y: (Math.random()-0.5) * 3000
  });

  document.getElementById("note").value="";
}

// 📡 تحميل
db.collection("notes").onSnapshot(snap=>{
  stars=[];
  snap.forEach(doc=>{
    stars.push(doc.data());
  });
});

// 👆 فتح نجمة
canvas.addEventListener("click",(e)=>{
  let mx=e.clientX;
  let my=e.clientY;

  for(let s of stars){
    let x = (s.x * scale) + offsetX;
    let y = (s.y * scale) + offsetY;

    let dx=mx-x;
    let dy=my-y;

    if(Math.sqrt(dx*dx+dy*dy)<15){
      alert("⭐ "+s.text+"\n📅 "+s.time);
    }
  }
});

// 🧭 Drag
function start(x,y){
  dragging=true;
  lastX=x;
  lastY=y;
}

function move(x,y){
  if(!dragging) return;

  offsetX += x-lastX;
  offsetY += y-lastY;

  lastX=x;
  lastY=y;
}

function end(){
  dragging=false;
}

// mouse
canvas.addEventListener("mousedown",e=>start(e.clientX,e.clientY));
canvas.addEventListener("mousemove",e=>move(e.clientX,e.clientY));
canvas.addEventListener("mouseup",end);
canvas.addEventListener("mouseleave",end);

// touch
canvas.addEventListener("touchstart",e=>{
  let t=e.touches[0];
  start(t.clientX,t.clientY);
},{passive:true});

canvas.addEventListener("touchmove",e=>{
  let t=e.touches[0];
  move(t.clientX,t.clientY);
},{passive:true});

canvas.addEventListener("touchend",end);

// 🔎 زووم (مهم حتى تشوف النجوم بسهولة)
window.addEventListener("wheel",(e)=>{
  if(e.deltaY < 0){
    scale += 0.1;
  }else{
    scale -= 0.1;
  }

  scale = Math.min(Math.max(scale,0.5),2);
});
