import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs }
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5-qUckXUdEtr-MR0DNqvGj50Nwg_4sxI",
  authDomain: "starnote-c41ba.firebaseapp.com",
  projectId: "starnote-c41ba",
  storageBucket: "starnote-c41ba.firebasestorage.app",
  messagingSenderId: "69065959769",
  appId: "1:69065959769:web:6288cb4bfbbcb46df30448"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sky = document.getElementById("sky");
const popup = document.getElementById("popup");
const btn = document.getElementById("btn");

// 🌌 تحميل النجوم من Firebase
async function loadStars(){

  sky.innerHTML = "";

  const snap = await getDocs(collection(db,"stars"));

  snap.forEach(doc => {
    drawStar(doc.data());
  });
}

// ⭐ رسم النجمة
function drawStar(data){

  const s = document.createElement("div");
  s.className = "star";

  s.style.left = data.x + "px";
  s.style.top = data.y + "px";

  s.onclick = () => {
    popup.style.display = "block";
    popup.innerHTML = `
      <h3>${data.name}</h3>
      <p>${data.message}</p>
      <small>${data.date}</small>
      <br><br>
      <button onclick="popup.style.display='none'">إغلاق</button>
    `;
  };

  sky.appendChild(s);
}

// ➕ إضافة نجمة إلى Firebase
btn.addEventListener("click", async () => {

  const name = document.getElementById("name").value;
  const msg = document.getElementById("msg").value;

  if(!name || !msg){
    alert("اكتب الاسم والذكرى");
    return;
  }

  await addDoc(collection(db,"stars"),{
    name:name,
    message:msg,
    date:new Date().toLocaleDateString(),
    x:Math.random()*window.innerWidth,
    y:Math.random()*window.innerHeight
  });

  document.getElementById("name").value = "";
  document.getElementById("msg").value = "";

  loadStars();
});

loadStars();