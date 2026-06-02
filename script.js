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

canvas.width = innerWidth;
canvas.height = innerHeight;

window.onresize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
};

// ⭐ النجوم (ذكريات)
let notes = [];

// 🎯 كاميرا
let camX = 0;
let camY = 0;

// 🌌 رسم مجرة مرتبة (spiral galaxy feel)
function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  for(let i=0;i<notes.length;i++){

    let n = notes[i];

    // 🌌 ترتيب مجرة spiral خفيف
    let angle = i * 0.5;
    let radius = Math.sqrt(i) * 30;

    let gx = Math.cos(angle) * radius + n.x;
    let gy = Math.sin(angle) * radius + n.y;

    let x = cx + (gx - camX);
    let y = cy + (gy - camY);

    let size = (n.size || 3);

    ctx.shadowBlur = 15;
    ctx.shadowColor = n.color;

    ctx.fillStyle = n.color;

    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI*2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // ❤️ عدد اللايكات يظهر صغير
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.fillText("❤️"+(n.likes||0), x+6, y-6);
  }
}
setInterval(draw,16);

// 💾 حفظ ذكرى
function saveNote(){

  let text = document.getElementById("note").value;
  if(!text) return;

  let colors = ["#fff","#ff8c00","#00f5ff","#ffd700","#a855f7","#ff4d6d"];

  db.collection("memories").add({
    text,
    color: colors[Math.floor(Math.random()*colors.length)],
    time: new Date().toLocaleString(),
    x: (Math.random()-0.5)*2000,
    y: (Math.random()-0.5)*2000,
    size: Math.random()*4 + 2,
    likes: 0
  });

  document.getElementById("note").value="";
}

// 🌍 تحميل البيانات
db.collection("memories").onSnapshot(snap=>{
  notes=[];
  snap.forEach(d=>{
    notes.push({
      id: d.id,
      ...d.data()
    });
  });
});

// 👆 فتح ذكرى
canvas.addEventListener("click",(e)=>{

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  for(let n of notes){

    let angle = notes.indexOf(n) * 0.5;
    let radius = Math.sqrt(notes.indexOf(n)) * 30;

    let gx = Math.cos(angle) * radius + n.x;
    let gy = Math.sin(angle) * radius + n.y;

    let x = cx + (gx - camX);
    let y = cy + (gy - camY);

    let dx = e.clientX - x;
    let dy = e.clientY - y;

    if(Math.sqrt(dx*dx+dy*dy) < 12){

      document.getElementById("popup").style.display="block";
      document.getElementById("txt").innerText = "⭐ " + n.text;
      document.getElementById("time").innerText = "📅 " + n.time;

      // 🧡 زر لايك داخل popup
      window.currentId = n.id;

      return;
    }
  }
});

// ❤️ نظام لايك
function likeMemory(){

  if(!window.currentId) return;

  let ref = db.collection("memories").doc(window.currentId);

  ref.get().then(doc=>{
    let likes = doc.data().likes || 0;

    ref.update({
      likes: likes + 1
    });
  });
}

// 🧭 حركة الفضاء
let dragging=false,lastX=0,lastY=0;

canvas.addEventListener("mousedown",(e)=>{
  dragging=true;
  lastX=e.clientX;
  lastY=e.clientY;
});

canvas.addEventListener("mousemove",(e)=>{
  if(!dragging) return;

  camX += lastX - e.clientX;
  camY += lastY - e.clientY;

  lastX=e.clientX;
  lastY=e.clientY;
});

canvas.addEventListener("mouseup",()=>dragging=false);

// 📱 touch
canvas.addEventListener("touchstart",(e)=>{
  dragging=true;
  lastX=e.touches[0].clientX;
  lastY=e.touches[0].clientY;
});

canvas.addEventListener("touchmove",(e)=>{
  if(!dragging) return;

  camX += lastX - e.touches[0].clientX;
  camY += lastY - e.touches[0].clientY;

  lastX=e.touches[0].clientX;
  lastY=e.touches[0].clientY;
});

canvas.addEventListener("touchend",()=>dragging=false);

// 🔒 popup
function closePopup(){
  document.
    getElementById("popup").style.display="none";
  window.currentId=null;
}
