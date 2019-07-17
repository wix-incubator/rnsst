const ws = require('ws');

module.exports.Server = class Server {
  constructor(port) {
    this.wsServer = new ws.Server({port});
    this.wsServer.on('connection', (s, req) => this.handleWS(s, req));
  }

  handleWS(socket) {
    socket.on('message', data => {
      this.wsServer.clients.forEach(c => {
        c.send(data);
      });
    });
  }
}
