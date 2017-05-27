const net = require('net');
const chatServer = net.createServer(),
  clientList = []

chatServer.on('connection', (client) => {
  client.name = client.remoteAddress + ':' + client.remotePort
  client.write('Hi' + client.name + '!\n');

  clientList.push(client)

  client.on('data', (data) => {
    broadcast(data, client)
  })

  client.on('end', () => {
    console.log(client.name + 'quit')
    clientList.splice(clientList.indexOf(client), 1)
  })

  client.on('error', (e) => {
    console.log(e)
  })
})

broadcast(message, client) => {
  var cleanup = []
  for (var i = 0; i < clientList.length; i += 1) {
    if (client !== clientList[i]) {

      if (clientList[i].writable) {
        clientList[i].write(client.name + " says " + message)
      } else {
        cleanup.push(clientList[i])
        clientList[i].destroy()
      }

    }
  }

  for (i = 0; i < cleanup.length; i += 1) {
    clientList.splice(clientList.indexOf(cleanup[i], 1))
  }
}

chatServer.listen(9000);
