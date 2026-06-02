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

// 🌌 Canvas
const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

// ✔ مهم للموبايل (يمنع التزحلق)
document.body.style.overflow = "hidden";

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ⭐ الرسائل
let stars = [];

// 🧭 حركة الفضاء
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let lastX = 0;
let lastY = 0;

// 🎨 رسم
function draw(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let s of stars){

    let x = s.x + offsetX;
    let y = s.y + offsetY;

    ctx.shadowBlur = 18;
    ctx.shadowColor = s.color;

    ctx.fillStyle = s.color;

    ctx.beginPath();
    ctx.arc(x,y,4,0,Math.PI*2);
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

  let colors = ["#ffffff","#ff8c00","#00f5ff","#ffd700","#a855f7","#ff4d6d"];

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
    stars.push(doc.data());
  });
});

// 👆 فتح رسالة
canvas.addEventListener("click",(e)=>{
  let mx=e.clientX;
  let my=e.clientY;

  for(let s of stars){
    let x = s.x + offsetX;
    let y = s.y + offsetY;

    let dx=mx-x;
    let dy=my-y;

    if(Math.sqrt(dx*dx+dy*dy)<10){
      alert("⭐ "+s.text+"\n📅 "+s.time);
    }
  }
});


// 🟢 دعم الماوس + اللمس (مستقر للموبايل)
function startDrag(x,y){
  isDragging=true;
  lastX=x;
  lastY=y;
}

function moveDrag(x,y){
  if(!isDragging) return;

  offsetX += x-lastX;
  offsetY += y-lastY;

  lastX=x;
  lastY=y;
}

function endDrag(){
  isDragging=false;
}

// 🖱️ mouse
canvas.addEventListener("mousedown",(e)=>startDrag(e.clientX,e.clientY));
canvas.addEventListener("mousemove",(e)=>moveDrag(e.clientX,e.clientY));
canvas.addEventListener("mouseup",endDrag);
canvas.addEventListener("mouseleave",endDrag);

// 📱 touch (مهم جداً)
canvas.addEventListener("touchstart",(e)=>{
  let t=e.touches[0];
  startDrag(t.clientX,t.clientY);
},{passive:true});

canvas.addEventListener("touchmove",(e)=>{
  let t=e.touches[0];
  moveDrag(t.clientX,t.clientY);
},{passive:true});

canvas.addEventListener("touchend",endDrag);
