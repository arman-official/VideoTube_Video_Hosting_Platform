import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'

const app = express()

app.use(express.static("public"))
import userRouter from './routes/user.router.js'

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(cookieParser())

app.use("/api/v1/users", userRouter)

export default app