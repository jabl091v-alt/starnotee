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

const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

window.onresize = () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
};

let stars = [];
let camX = 0;
let camY = 0;

// 🌌 رسم المجرة
function draw(){

  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  camX *= 0.95;
  camY *= 0.95;

  for(let s of stars){

    let x = cx + (s.x - camX);
    let y = cy + (s.y - camY);

    let size = 2 + (s.power || 1);

    ctx.shadowBlur = 20;
    ctx.shadowColor = s.color;

    ctx.fillStyle = s.color;

    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI*2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(draw);
}
draw();

// 💾 حفظ ذكرى
function saveNote(){

  let text = document.getElementById("note").value;
  if(!text) return;

  let colors = ["#fff","#ff8c00","#00f5ff","#ffd700","#a855f7"];

  db.collection("memories").add({
    text,
    color: colors[Math.floor(Math.random()*colors.length)],
    time: new Date().toLocaleString(),
    x: (Math.random()-0.5)*3000,
    y: (Math.random()-0.5)*3000,
    power: Math.random()*2 + 1
  });

  document.getElementById("note").value="";
}

// 🌍 كل الناس يشوفون نفس المجرة
db.collection("memories").onSnapshot(snap=>{
  stars = [];
  snap.forEach(d=>{
    stars.push(d.data());
  });
});

// 👆 فتح ذكرى
canvas.addEventListener("click",(e)=>{

  let cx = canvas.width/2;
  let cy = canvas.height/2;

  for(let s of stars){

    let x = cx + (s.x - camX);
    let y = cy + (s.y - camY);

    let dx = e.clientX - x;
    let dy = e.clientY - y;

    if(Math.sqrt(dx*dx+dy*dy) < 15){

      document.getElementById("popup").style.display="block";
      document.getElementById("txt").innerText = "⭐ " + s.text;
      document.getElementById("time").innerText = "📅 " + s.time;

      return;
    }
  }
});

// 🎮 سحب بسيط للمجرة
let drag=false,lastX=0,lastY=0;

canvas.addEventListener("mousedown",(e)=>{
  drag=true;
  lastX=e.clientX;
  lastY=e.clientY;
});

canvas.addEventListener("mousemove",(e)=>{
  if(!drag) return;

  camX += (lastX - e.clientX);
  camY += (lastY - e.clientY);

  lastX=e.clientX;
  lastY=e.clientY;
});

canvas.addEventListener("mouseup",()=>drag=false);

// 📱 touch
canvas.addEventListener("touchstart",(e)=>{
  drag=true;
  lastX=e.touches[0].clientX;
  lastY=e.touches[0].clientY;
});

canvas.addEventListener("touchmove",(e)=>{
  if(!drag) return;

  camX += (lastX - e.touches[0].clientX);
  camY += (lastY - e.touches[0].clientY);

  lastX=e.touches[0].clientX;
  lastY=e.touches[0].clientY;
});

canvas.addEventListener("touchend",()=>drag=false);

// 🔒 popup
function closePopup(){
  document.getElementById("popup").style.display="none";
}
