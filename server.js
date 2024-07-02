const dgram = require('dgram');
const http = require('http');
const socketIo = require('socket.io');

const app = http.createServer();
const io = socketIo(app);

const udpServer = dgram.createSocket('udp4');

const UDP_PORT = 9060; 
const UDP_HOST = '127.0.0.1'; 

const WS_PORT = 3000;  

function decodeHEPMessage(message) {
    const data = message.toString('utf8');

    // Tenta identificar e extrair a mensagem SIP dentro dos dados HEP
    const sipStartIndex = data.indexOf('SIP/2.0');
    if (sipStartIndex !== -1) {
        const sipMessage = data.slice(sipStartIndex);
        return { sipMessage };
    }

    // Se a mensagem SIP não for encontrada, retorne os dados crus
    return { rawData: data };    
}

udpServer.on('message', (message, remote) => {
    const hepData = decodeHEPMessage(message);
    console.log(`Pacote HEP recebido de ${remote.address}:${remote.port}`);
    console.log('Dados HEP:', hepData);

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
