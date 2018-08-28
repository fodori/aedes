'use strict'

var mqtt = require('mqtt-packet')

function write (client, packet, done) {
  if (packet.cmd === 'publish') {
    console.log('writeeeeee: ',client.id,packet.topic)
    //console.trace()
  }
  var result = mqtt.writeToStream(packet, client.conn)

  if (!result && !client.errored && done) {
    client.conn.once('drain', done)
  } else if (done) {
    setImmediate(done)
  }
}

module.exports = write
