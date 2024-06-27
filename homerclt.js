const io = require("socket.io-client");

const socket = io("http://192.168.2.235:3000"); // Substitua pelo IP e porta do seu servidor

socket.on("connect", () => {
  console.log("Conectado ao servidor WebSocket");
});

socket.on("hep", (data) => {
  console.log("Dados HEP recebidos:", data);
  // Processar os dados HEP conforme necessário
});

socket.on("disconnect", () => {
  console.log("Desconectado do servidor WebSocket");
});
