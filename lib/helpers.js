const crypto = require('crypto')
const config = require('./config')

const helpers = {}
helpers.hashPassword = function (str){
    const hash = crypto.createHmac("sha256",config.hashingSecret).update(str).digest("hex")
    return hash
}
helpers.randomString = function (len){
  const allcharacters = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
  
  let str = ""
  for (let i = 0; i < len; i++) {
     const randomChar = allcharacters.charAt(Math.floor(Math.random() * allcharacters.length))
      str = str + randomChar
  }
  return str
}
module.exports = helpers