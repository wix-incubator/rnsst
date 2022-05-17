import * as ws from 'ws';

export default class Server {
  wsServer: ws.Server;

  constructor(port: number) {
    this.wsServer = new ws.Server({port});
    this.wsServer.on('connection', this.handleWS);
  }

  getUrl = () => {
    const address = this.wsServer.address();
    return typeof address === 'string' ? address : `ws://localhost:${address.port}`;
  };

  handleWS = (socket: ws.Server) => {
    socket.on('message', (data) => {
      this.wsServer.clients.forEach((c) => {
        c.send(data);
      });
    });
  };

  stop = () => {
    this.wsServer.close();
  };
}
