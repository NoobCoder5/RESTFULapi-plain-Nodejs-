const enviroments = {}

enviroments.staging = {
    "httpPort" : 5000,
    "httpsPort" : 5001,
    "envName":"staging",
    "hashingSecret":"thisAsecret",
    "maxChecks":5,
    'twilio' : {
        'accountSid' : 'AC1a9889edf257cf8048be87b2677fbdcc',
        'authToken' : '8a99dc52e728d2ef8c6a1289c81e923e',
        'fromPhone' : '+18593747323'
      }
}
enviroments.production = {
    'httpPort' : 7000,
    'httpsPort' :7001,
    'envName':"production",
    "hashingSecret":"thisAsecret",
    "maxChecks":5
}

const currentEnviroment = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase():"";
const enviromentToExport = typeof(enviroments[currentEnviroment]) == "object" ? enviroments[currentEnviroment] : enviroments.staging

module.exports = enviromentToExport