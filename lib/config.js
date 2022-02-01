const enviroments = {}

enviroments.staging = {
    "httpPort" : 5000,
    "httpsPort" : 5001,
    "envName":"staging",
    "hashingSecret":"thisAsecret"
}
enviroments.production = {
    'httpPort' : 7000,
    'httpsPort' :7001,
    'envName':"production",
    "hashingSecret":"thisAsecret"
}

const currentEnviroment = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase():"";
const enviromentToExport = typeof(enviroments[currentEnviroment]) == "object" ? enviroments[currentEnviroment] : enviroments.staging

module.exports = enviromentToExport