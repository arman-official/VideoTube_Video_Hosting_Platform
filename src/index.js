import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app=express()
import mongoose from 'mongoose'

import connectDB from './config/db.js'
console.log("ENV:", process.env.MONGO_URI)
connectDB()
const PORT= process.env.PORT || 3000


app.get("/",(req,res)=>{
    res.send('server is running')
})

app.listen(PORT,()=>{
    console.log( `server is running at ${PORT}`)
})