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

// 🧭 حركة الفضاء
let offsetX = 0;
let offsetY = 0;
let dragging = false;
let lastX = 0;
let lastY = 0;

// ✨ تأثير النبض
function draw(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let s of stars){

    let x = s.x + offsetX;
    let y = s.y + offsetY;

    // 🔥 حركة خفيفة (floating)
    s.float = (s.float || 0) + 0.02;
    let floatY = Math.sin(s.float) * 2;

    // ⭐ نبض عند الظهور
    if(!s.pulse) s.pulse = 1;
    s.pulse += (1 - s.pulse) * 0.1;

    let size = 3 * s.pulse;

    // ✨ Glow قوي
    ctx.shadowBlur = 25;
    ctx.shadowColor = s.color || "#ffffff";

    ctx.fillStyle = s.color || "#ffffff";

    ctx.beginPath();
    ctx.arc(x, y + floatY, size, 0, Math.PI*2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(draw);
}
draw();

// 💾 حفظ رسالة
function saveNote(){
  let text = document.getElementById("note").value;
  if(!text) return;

  let colors = [
    "#ffffff",
    "#ff8c00",
    "#00f5ff",
    "#ffd700",
    "#a855f7",
    "#ff4d6d"
  ];

  let color = colors[Math.floor(Math.random()*colors.length)];

  db.collection("notes").add({
    text,
    color,
    time:new Date().toLocaleString(),
    x:Math.random()*2000-1000,
    y:Math.random()*2000-1000
  });

  document.getElementById("note").value="";
}

// 📡 تحميل
db.collection("notes").onSnapshot(snap=>{
  stars=[];
  snap.forEach(doc=>{
    let d = doc.data();

    // حماية
    d.pulse = 0.2; // يبدأ صغير ثم يكبر (تأثير ولادة نجمة)

    stars.push(d);
  });
});

// 👆 فتح
canvas.addEventListener("click",(e)=>{
  let mx=e.clientX;
  let my=e.clientY;

  for(let s of stars){
    let x = s.x + offsetX;
    let y = s.y + offsetY;

    let dx=mx-x;
    let dy=my-y;

    if(Math.sqrt(dx*dx+dy*dy)<12){
      document.getElementById("popup").style.display="block";
      document.getElementById("txt").innerText="⭐ "+s.text;
      document.getElementById("time").innerText="📅 "+s.time;
    }
  }
});

function closePopup(){
  document.getElementById("popup").style.display="none";
}

// 🧭 drag
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

canvas.addEventListener("mousedown",e=>start(e.clientX,e.clientY));
canvas.addEventListener("mousemove",e=>move(e.clientX,e.clientY));
canvas.addEventListener("mouseup",end);
canvas.addEventListener("mouseleave",end);

canvas.addEventListener("touchstart",e=>{
  let t=e.touches[0];
  start(t.clientX,t.clientY);
},{passive:true});

canvas.addEventListener("touchmove",e=>{
  let t=e.touches[0];
  move(t.clientX,t.clientY);
},{passive:true});

canvas.addEventListener("touchend",end);
