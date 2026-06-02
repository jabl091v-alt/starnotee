const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

// ⭐ رسم النجوم
function draw(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let s of stars){
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

// 💫 إضافة نجمة جديدة
function addStar(){
  let text = document.getElementById("note").value;
  if(!text) return;

  stars.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    size: Math.random()*3+2,
    color: "white",
    text: text
  });

  document.getElementById("note").value = "";
}
