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

// 🧭 مركز المجرة
let angle = 0;

// 🌊 رسم
function draw(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  angle += 0.0003; // دوران خفيف جداً

  for(let s of stars){

    // 🌌 تحويل لمجرة + دوران بسيط
    let rx = s.x * Math.cos(angle) - s.y * Math.sin(angle);
    let ry = s.x * Math.sin(angle) + s.y * Math.cos(angle);

    let x = cx + rx * 0.25;
    let y = cy + ry * 0.25;

    // 🌊 طفو خفيف (هذا المهم اللي طلبته)
    let floatX = Math.sin(Date.now()*0.001 + s.seed) * 0.6;
    let floatY = Math.cos(Date.now()*0.001 + s.seed) * 0.6;

    // ⭐ حجم ناعم
    let size = 3.5;

    ctx.shadowBlur = 18;
    ctx.shadowColor = s.color || "#fff";

    ctx.fillStyle = s.color || "#fff";

    ctx.beginPath();
    ctx.arc(x + floatX, y + floatY, size, 0, Math.PI*2);
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

  let colors = ["#fff","#ff8c00","#00f5ff","#ffd700","#a855f7","#ff4d6d"];

  db.collection("notes").add({
    text,
    color: colors[Math.floor(Math.random()*colors.length)],
    time: new Date().toLocaleString(),

    x: (Math.random()-0.5)*2000,
    y: (Math.random()-0.5)*2000,

    seed: Math.random()*1000 // 🌊 مهم للطفو المختلف لكل نجمة
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

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  for(let s of stars){

    let rx = s.x;
    let ry = s.y;

    let x = cx + rx * 0.25;
    let y = cy + ry * 0.25;

    let dx = mx - x;
    let dy = my - y;

    if(Math.sqrt(dx*dx + dy*dy) < 12){
      alert("⭐ "+s.text+"\n📅 "+s.time);
    }
  }
});
