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

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
window.onresize = resize;

// ⭐ الرسائل
let stars = [];

// 🧭 Pan (سحب الفضاء)
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

    ctx.shadowBlur = 20;
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
    text:text,
    color:color,
    time:new Date().toLocaleString(),
    x:Math.random()*2000 - 1000,
    y:Math.random()*2000 - 1000
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
    let x = s.x + offsetX;
    let y = s.y + offsetY;

    let dx=mx-x;
    let dy=my-y;

    if(Math.sqrt(dx*dx+dy*dy)<10){
      openPopup(s);
    }
  }
});

// 🟢 Drag start
canvas.addEventListener("mousedown",(e)=>{
  isDragging=true;
  lastX=e.clientX;
  lastY=e.clientY;
});

// 🟢 Drag move
canvas.addEventListener("mousemove",(e)=>{
  if(!isDragging) return;

  let dx=e.clientX-lastX;
  let dy=e.clientY-lastY;

  offsetX+=dx;
  offsetY+=dy;

  lastX=e.clientX;
  lastY=e.clientY;
});

// 🟢 Drag end
canvas.addEventListener("mouseup",()=>isDragging=false);
canvas.addEventListener("mouseleave",()=>isDragging=false);

// 👇 popup
function openPopup(s){
  document.getElementById("popup").style.display="block";
  document.getElementById("txt").innerText="⭐ "+s.text;
  document.getElementById("time").innerText="📅 "+s.time;
}

function closePopup(){
  document.getElementById("popup").style.display="none";
}
