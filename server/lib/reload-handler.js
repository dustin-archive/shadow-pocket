
const crypto = require('crypto')
const clients = new Map()

function reload () {
  for (const [key] of clients) {
    clients.get(key).write('data:reload\n\n')
  }
}

function handler (res) {
  const id = crypto.randomBytes(6).toString('hex')

  res.setHeader('content-type', 'text/event-stream')
  res.write('data:connect\n\n')

  clients.set(id, res)

  const heartbeat = setInterval(function () {
    res.write(':\n\n')
  }, 90000)

  res.on('aborted', function () {
    clearInterval(heartbeat)
    clients.delete(id)
  })
}

module.exports = {
  handler: handler,
  reload: reload
}
