const dgram = require('dgram');
const http = require('http');
const socketIo = require('socket.io');

// Criar servidor HTTP para WebSocket
const app = http.createServer();
const io = socketIo(app);

const udpServer = dgram.createSocket('udp4');

const UDP_PORT = 9060;  // Porta configurada no hep.conf do Asterisk 
const UDP_HOST = '127.0.0.1';  // Endereço IP 

const WS_PORT = 3000;   // Porta do WebSocket (para o cliente conectar-se)

function decodeHEPMessage(message) {
    const data = message.toString('utf8');
    return data;
}

udpServer.on('message', (message, remote) => {
    const hepData = decodeHEPMessage(message);
    console.log(`Pacote HEP recebido de ${remote.address}:${remote.port}`);
    //console.log(`Dados: ${hepData}`);

    // Enviar dados para o cliente
    io.emit('hep', hepData);

});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`Servidor HEP escutando em ${address.address}:${address.port}`);
});

udpServer.on('error', (err) => {
    console.error(`Erro no servidor UDP: ${err.stack}`);
    udpServer.close();
});

udpServer.bind(UDP_PORT, UDP_HOST);

app.listen(WS_PORT, () => {
    console.log(`Servidor WebSocket escutando em http://localhost:${WS_PORT}`);
});