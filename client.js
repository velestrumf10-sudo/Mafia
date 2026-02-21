const socket = io();
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let players = [];
let roles = {};
let phase = "night";

document.getElementById("joinBtn").onclick = () => {
  let name = document.getElementById("nameInput").value || "Player";
  socket.emit("joinLobby", name);
};

document.getElementById("startBtn").onclick = () => {
  let mafiaNum = parseInt(document.getElementById("mafiaSelect").value);
  socket.emit("startGame", mafiaNum);
  document.getElementById("menu").style.display="none";
};

socket.on("updatePlayers", data => { players = data; drawPlayers(); });
socket.on("gameStart", data => { players = data.players; roles = data.roles; phase = data.phase; drawPlayers(); });
socket.on("phaseChange", newPhase => { phase = newPhase; drawPlayers(); });

function drawPlayers(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = phase==="night"?"rgba(0,0,0,0.7)":"rgba(50,50,50,0.5)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  players.forEach((p,i)=>{
    let x = 100 + i*70;
    let y = 300;
    ctx.fillStyle = `hsl(${i*50},70%,50%)`;
    ctx.beginPath();
    ctx.arc(x,y,25,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle="white";
    ctx.fillText(p.name, x-20, y-30);
  });

  ctx.fillStyle="white";
  ctx.fillText("Phase: "+phase, 10, 20);
}