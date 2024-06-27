# HEP -SERVER

working (need to be setup like Homer)

---

Este código consegue captar os pacotes HEP de um socket UDP e envia-os para clientes WebSocket que estejam ligados. 

Esta aplicação utiliza duas bibliotecas importantes o dgram para comunicação UDP e a [socket.io](http://socket.io) para comunicação WebSocket.

---

```jsx
const dgram = require('dgram');
const http = require('http');
const socketIo = require('socket.io');

// Criar servidor HTTP para WebSocket
const app = http.createServer();
const io = socketIo(app);

// Criar servidor UDP
const udpServer = dgram.createSocket('udp4');

// Configurações da porta e do endereço UDP
const UDP_PORT = 9060;  // Porta configurada no hep.conf do Asterisk 
const UDP_HOST = '127.0.0.1';  // Endereço IP onde o servidor UDP estará a escuta

// Configuração da porta WebSocket para conexão dos clientes
const WS_PORT = 3000;   

// Função para decodificar mensagens HEP recebidas.
function decodeHEPMessage(message) {
    const data = message.toString('utf8');
    return data;
}
/*
	UDP
*/
// Esta função fica a espera de receber os pacotes e quando os recebe envia para os cliente WS
udpServer.on('message', (message, remote) => {
    const hepData = decodeHEPMessage(message);
    console.log(`Pacote HEP recebido de ${remote.address}:${remote.port}`);
    //console.log(`Dados: ${hepData}`);

    // Enviar dados decodificados para todos os clientes WebSocket conectados
    io.emit('hep', hepData);

});

// Listener para quando o servidor UDP está escutando
udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`Servidor HEP escutando em ${address.address}:${address.port}`);
});
// Listener para erros no servidor UDP
udpServer.on('error', (err) => {
    console.error(`Erro no servidor UDP: ${err.stack}`);
    udpServer.close();
});
// Conecta o servidor UDP à porta e endereço configurados acima
udpServer.bind(UDP_PORT, UDP_HOST);

// Inicia o servidor HTTP e escuta na porta WebSocket especificada
app.listen(WS_PORT, () => {
    console.log(`Servidor WebSocket escutando em http://localhost:${WS_PORT}`);
});
```

---

### Descrição

1. **Módulos Importados:**
    - `dgram`: Módulo para criar sockets UDP.
    - `http`: Módulo para criar servidor HTTP.
    - `socket.io`: Biblioteca para comunicação em tempo real via WebSocket.
2. **Criar Servidor HTTP e WebSocket:**
    - `app`: Cria um servidor HTTP usando `http.createServer()`.
    - `io`: Cria um servidor WebSocket utilizando `socketIo(app)`.
3. **Criar Servidor UDP:**
    - `udpServer`: Cria um servidor UDP usando `dgram.createSocket('udp4')`.
4. **Configurações de Porta e Endereço:**
    - `UDP_PORT`: Porta na qual o servidor UDP escuta as mensagens HEP.
    - `UDP_HOST`: Endereço IP onde o servidor UDP está configurado para escutar.
5. **Porta WebSocket:**
    - `WS_PORT`: Porta na qual os clientes WebSocket devem se conectar.
6. **Função `decodeHEPMessage`:**
    - Função que decodifica uma mensagem recebida via UDP de Buffer para uma string UTF-8.
7. **Eventos do Servidor UDP:**
    - `'message'`: Evento disparado quando uma mensagem UDP é recebida. Decodifica a mensagem usando `decodeHEPMessage` e a emite para todos os clientes WebSocket conectados.
    - `'listening'`: Evento disparado quando o servidor UDP inicia a escuta. Loga o endereço IP e porta onde o servidor está escutando.
    - `'error'`: Evento disparado em caso de erro no servidor UDP. Loga o erro e fecha o servidor.
8. **Binding do Servidor UDP:**
    - `udpServer.bind(UDP_PORT, UDP_HOST)`: Liga o servidor UDP à porta e endereço configurados.
9. **Iniciar Servidor HTTP e WebSocket:**
    - `app.listen(WS_PORT)`: Inicia o servidor HTTP e WebSocket na porta especificada (`WS_PORT`). Conecta a URL onde o servidor WebSocket está disponível.

Este código é projectado para receber mensagens HEP via UDP, decodificá-las e transmiti-las em tempo real para clientes conectados através de WebSocket, permitindo monitoramento e análise em tempo real de dados específicos.
---
# HEP -CLIENT

Este código é utilizado para conectar um cliente (neste caso, um script Node.js) a um servidor WebSocket específico, permitindo receber e processar dados HEP enviados pelo servidor em tempo real.

---

```jsx
const io = require('socket.io-client');

// Conectar ao servidor WebSocket
const socket = io('http://192.168.2.235:3000'); // Substituir pelo IP e porta do seu servidor

// Evento de conexão bem-sucedida ao servidor WebSocket
socket.on('connect', () => {
    console.log('Conectado ao servidor WebSocket');
});

// Evento para receber dados HEP do servidor WebSocket
socket.on('hep', (data) => {
    console.log('Dados HEP recebidos:', data);
    // Processar os dados HEP conforme necessário
});

// Evento de desconexão do servidor WebSocket
socket.on('disconnect', () => {
    console.log('Desconectado do servidor WebSocket');
});

```

---

### Descrição

1. **Importar o módulo `socket.io-client`:**
    - `io`: Importa o módulo necessário para estabelecer a conexão com um servidor WebSocket.
2. **Conectar ao Servidor WebSocket:**
    - `socket`: Cria uma conexão com o servidor WebSocket especificado através do método `io("http://192.168.2.235:3000")`. Substitua `"http://192.168.2.235:3000"` pelo endereço IP e porta do seu servidor WebSocket.
3. **Eventos do Cliente WebSocket:**
    - `'connect'`: Evento disparado quando a conexão com o servidor WebSocket é estabelecida com sucesso. Escreve na consola uma mensagem indicando a conexão bem-sucedida.
    - `'hep'`: Evento disparado quando o servidor WebSocket envia dados com o evento `'hep'`. Recebe `data` como parâmetro, que contém os dados HEP recebidos. Escreve na consola os dados HEP recebidos e permite processá-los conforme necessário.
    - `'disconnect'`: Evento disparado quando o cliente é desconectado do servidor WebSocket. Escreve na consola uma mensagem indicando a desconexão.
