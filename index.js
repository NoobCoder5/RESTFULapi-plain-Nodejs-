const server = require('./lib/server')
const worker = require('./lib/worker')

const app = {}

app.init = function(){
  server.init()
}

app.init()
module.exports = app