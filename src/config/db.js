import mongoose from 'mongoose'

const connectDB= async ()=>{
    try{
        const conn= await mongoose.connect(process.env.MONGO_URI)
        console.log(`database connected at ${conn.connection.host}`)
    }catch(error){
        console.error("error in connecting db: ",error)
        process.exit(1)
    }
}

module.exportst =  connectDB