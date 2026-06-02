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

// ⭐ البيانات
let notes = [];

// 🌌 رسم
function draw(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  for(let n of notes){

    let x = cx + (n.x || 0);
    let y = cy + (n.y || 0);

    ctx.shadowBlur = 18;
    ctx.shadowColor = n.color || "#fff";
    ctx.fillStyle = n.color || "#fff";

    ctx.beginPath();
    ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(draw);
}
draw();

// 💾 حفظ
function saveNote(){
  let text = document.getElementById("note").value;
  if(!text) return;

  let colors = ["#fff","#ff8c00","#00f5ff","#ffd700","#a855f7","#ff4d6d"];

  db.collection("notes").add({
    text,
    color: colors[Math.floor(Math.random()*colors.length)],
    time: new Date().toLocaleString(),
    x:(Math.random()-0.5)*2000,
    y:(Math.random()-0.5)*2000
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

// 🟢 دالة لمس موحدة (موبايل + كمبيوتر)
function getPos(e){
  let rect = canvas.getBoundingClientRect();

  let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  let y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  return {x,y};
}

// 👆 فتح نجمة (مضمون للموبايل)
function checkClick(e){

  let pos = getPos(e);

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  for(let n of notes){

    let x = cx + (n.x || 0);
    let y = cy + (n.y || 0);

    let dx = pos.x - x;
    let dy = pos.y - y;

    if(Math.sqrt(dx*dx + dy*dy) < 14){

      alert("⭐ " + n.text + "\n📅 " + n.time);
      return;
    }
  }
}

// 🖱 كمبيوتر
canvas.addEventListener("click",checkClick);

// 📱 موبايل
canvas.addEventListener("touchstart",function(e){
  e.preventDefault();
  checkClick(e);
},{passive:false});
