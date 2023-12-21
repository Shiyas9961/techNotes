const express = require('express')
require('dotenv').config()
const app = express()
const path = require('path')
const root = require('./routes/root') //Base route
const userRoute = require('./routes/userRoutes') //User route
const noteRoute = require('./routes/noteRoutes') //Note route
const authRoute = require('./routes/authRoutes')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { logger,logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const corsOption = require('./config/corsOption')
const connectDB = require('./config/DBConn')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOption))

app.use(express.json())

app.use(cookieParser())

app.use(express.static(path.join(__dirname,'public')))

app.use('/', root)
app.use('/auth', authRoute)
app.use('/users', userRoute)
app.use('/notes', noteRoute)

app.all('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({message : '404 Not Found !'})
    }else{
        res.type('text').send('404 Not Found !')
    }
})


app.use(errorHandler)

mongoose.connection.once('open',()=>{
    console.log('MongoDB is Connected')
    app.listen(PORT,()=>console.log(`Server is running at ${PORT}`))
})

mongoose.connection.on('error',(err)=>{
    console.log(err)
    logEvents(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErr.log')
})