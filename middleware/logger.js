const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises


//middleware - Helper function
const logEvents = async (message, logFileName) => {
    const dateItem = format(new Date(),'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateItem}\t${uuid()}\t${message}\n`

    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..','logs',))
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',logFileName),logItem)
    }catch(err){
        console.log(err.message)
    }
}

//middleware - Req Details
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,'reqLog.log')
    console.log(`${req.method}\t${req.path}`)
    next()
}

module.exports = {
    logEvents,
    logger
}