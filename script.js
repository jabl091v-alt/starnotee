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

// ⭐ نجوم (مهم: fallback حتى لا يختفي شيء)
let notes = [];

// 🧠 لو Firebase فشل، نسوي نجوم وهمية
for(let i=0;i<50;i++){
  notes.push({
    text:"demo",
    color:"#ffffff",
    x:(Math.random()-0.5)*2000,
    y:(Math.random()-0.5)*2000,
    depth:Math.random()*0.8+0.2,
    time:"demo"
  });
}

// 🎨 رسم دائم
function draw(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  for(let n of notes){

    let depth = n.depth || 1;

    let x = cx + (n.x || 0) * depth;
    let y = cy + (n.y || 0) * depth;

    let size = 3 + depth * 3;

    ctx.shadowBlur = 20;
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

// 💾 حفظ رسالة
function saveNote(){
  let text = document.getElementById("note").value;
  if(!text) return;

  let colors = ["#fff","#ff8c00","#00f5ff","#ffd700","#a855f7"];

  db.collection("notes").add({
    text,
    color: colors[Math.floor(Math.random()*colors.length)],
    time: new Date().toLocaleString(),
    x:(Math.random()-0.5)*2000,
    y:(Math.random()-0.5)*2000,
    depth:Math.random()*0.8+0.2
  });

  document.getElementById("note").value="";
}

// 📡 تحميل
db.collection("notes").onSnapshot(snap=>{
  let arr=[];
  snap.forEach(d=>{
    arr.push(d.data());
  });

  // إذا فاضي، لا تفرغ الشاشة
  if(arr.length > 0){
    notes = arr;
  }
});
