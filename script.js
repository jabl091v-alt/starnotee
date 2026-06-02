const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let stars = [];

// ⭐ نجوم ثابتة للتأكد
for(let i=0;i<50;i++){
  stars.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*3+1
  });
}

function draw(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let s of stars){
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();
