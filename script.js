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

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ⭐ layers
let notes = [];

// 👁 كاميرا ناعمة
let camX = 0;
let camY = 0;

// 🌌 رسم فضاء واقعي
function draw(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  // كاميرا تتحرك شوي (parallax feel)
  camX += (mouseX - camX) * 0.02;
  camY += (mouseY - camY) * 0.02;

  for(let n of notes){

    let depth = n.depth || 1;

    let x = cx + (n.x - camX) * depth;
    let y = cy + (n.y - camY) * depth;

    let size = 2 + depth * 3;

    // glow واقعي
    ctx.shadowBlur = 25 * depth;
    ctx.shadowColor = n.color || "#fff";

    ctx.fillStyle = n.color || "#fff";

    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI*2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(draw);
}
draw();

// 🖱 حركة خفيفة للكاميرا
let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove",(e)=>{
  mouseX = (e.clientX - window.innerWidth/2) * 0.05;
  mouseY = (e.clientY - window.innerHeight/2) * 0.05;
});

// 💾 حفظ
function saveNote(){
  let text = document.getElementById("note").value;
  if(!text) return;

  let colors = ["#ffffff","#ff8c00","#00f5ff","#ffd700","#a855f7"];

  db.collection("notes").add({
    text,
    color: colors[Math.floor(Math.random()*colors.length)],
    time: new Date().toLocaleString(),

    x: (Math.random()-0.5)*3000,
    y: (Math.random()-0.5)*3000,

    depth: Math.random()*0.8 + 0.2 // ⭐ عمق واقعي
  });

  document.getElementById("note").value="";
}

// 📡 تحميل
db.collection("notes").onSnapshot(snap=>{
  notes=[];
  snap.forEach(d=>{
    notes.push(d.data());
  });
});

// 👆 فتح
canvas.addEventListener("click",(e)=>{
  let cx = canvas.width/2;
  let cy = canvas.height/2;

  for(let n of notes){

    let x = cx + (n.x - camX) * (n.depth||1);
    let y = cy + (n.y - camY) * (n.depth||1);

    let dx = e.clientX - x;
    let dy = e.clientY - y;

    if(Math.sqrt(dx*dx+dy*dy) < 12){
      alert("⭐ "+n.text+"\n📅 "+n.time);
    }
  }
});
