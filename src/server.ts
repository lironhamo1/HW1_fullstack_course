import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()

console.log("seerver is starting..")

import mongoose from 'mongoose'
mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error',(error)=>{
    console.error(error)
})
db.once('open',()=>{
    console.log('connected to mongo')
})

import bodyparser from 'body-parser'
app.use(bodyparser.urlencoded( { extended:true , limit:'1mb' } ))
app.use(bodyparser.json())


import post_routes from './routes/post_routes'
app.use('/post',post_routes)

import auth_routes from './routes/auth_routes'
app.use('/auth',auth_routes)


export = app
