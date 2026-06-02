// 🔥 Firebase Config
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

// ⭐ نجوم = رسائل
let stars = [];

// 🎨 رسم النجوم
function draw(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let s of stars){
    ctx.fillStyle=s.color || "white";

    ctx.beginPath();
    ctx.arc(s.x,s.y,4,0,Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

// 💾 حفظ رسالة
function saveNote(){
  let text = document.getElementById("note").value;
  if(!text) return;

  let colors = ["white","cyan","gold","violet","pink"];
  let color = colors[Math.floor(Math.random()*colors.length)];

  db.collection("notes").add({
    text:text,
    time:new Date().toLocaleString(),
    x:Math.random()*window.innerWidth,
    y:Math.random()*window.innerHeight,
    color:color
  });

  document.getElementById("note").value="";
}

// 📡 تحميل الرسائل
db.collection("notes").onSnapshot(snap=>{
  stars=[];
  snap.forEach(doc=>{
    stars.push(doc.data());
  });
});

// 👆 فتح النجمة
canvas.addEventListener("click",(e)=>{
  let mx=e.clientX;
  let my=e.clientY;

  for(let s of stars){
    let dx=mx-s.x;
    let dy=my-s.y;

    if(Math.sqrt(dx*dx+dy*dy)<10){
      openPopup(s);
    }
  }
});

function openPopup(s){
  document.getElementById("popup").style.display="block";
  document.getElementById("txt").innerText="⭐ "+s.text;
  document.getElementById("time").innerText="📅 "+s.time;
}

function closePopup(){
  document.getElementById("popup").style.display="none";
}
