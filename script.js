// Firebase
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

// Canvas
const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

// ⭐ النجوم (ذكريات)
let notes = [];

// 🎯 camera (حركة داخل الفضاء فقط)
let camX = 0;
let camY = 0;
let dragging = false;
let lastX = 0;
let lastY = 0;

// 🎨 رسم ثابت (بدون animation معقدة)
function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  for(let n of notes){

    let x = cx + (n.x - camX);
    let y = cy + (n.y - camY);

    let size = n.size || 3;

    ctx.shadowBlur = 15;
    ctx.shadowColor = n.color;

    ctx.fillStyle = n.color;

    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI*2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }
}
setInterval(draw, 16);

// 💾 حفظ ذكرى
function saveNote(){

  let text = document.getElementById("note").value;
  if(!text) return;

  let colors = ["#fff","#ff8c00","#00f5ff","#ffd700","#a855f7","#ff4d6d"];

  db.collection("memories").add({
    text,
    color: colors[Math.floor(Math.random()*colors.length)],
    time: new Date().toLocaleString(),

    x: (Math.random()-0.5)*3000,
    y: (Math.random()-0.5)*3000,

    size: Math.random()*4 + 2
  });

  document.getElementById("note").value="";
}

// 🌍 كل الناس يشوفون نفس الذكريات
db.collection("memories").onSnapshot(snap=>{
  notes=[];
  snap.forEach(d=>{
    notes.push(d.data());
  });
});

// 👆 فتح نجمة
canvas.addEventListener("click",(e)=>{

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  for(let n of notes){

    let x = cx + (n.x - camX);
    let y = cy + (n.y - camY);

    let dx = e.clientX - x;
    let dy = e.clientY - y;

    if(Math.sqrt(dx*dx+dy*dy) < 12){

      document.getElementById("popup").style.display="block";
      document.getElementById("txt").innerText = "⭐ " + n.text;
      document.getElementById("time").innerText = "📅 " + n.time;

      return;
    }
  }
});

// 🧭 حركة داخل الفضاء (سحب فقط)
canvas.addEventListener("mousedown",(e)=>{
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener("mousemove",(e)=>{
  if(!dragging) return;

  camX += lastX - e.clientX;
  camY += lastY - e.clientY;

  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener("mouseup",()=>dragging=false);
canvas.addEventListener("mouseleave",()=>dragging=false);

// 📱 touch
canvas.addEventListener("touchstart",(e)=>{
  dragging = true;
  lastX = e.touches[0].clientX;
  lastY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove",(e)=>{
  if(!dragging) return;

  camX += lastX - e.touches[0].clientX;
  camY += lastY - e.touches[0].clientY;

  lastX = e.touches[0].clientX;
  lastY = e.touches[0].clientY;
});

canvas.addEventListener("touchend",()=>dragging=false);

// 🔒 popup
function closePopup(){
  document.getElementById("popup").style.display="none";
}
