const mongoose=require("mongoose")

const dbconnection=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("MONGODB IS CONNECTED SUCCESFULLY")
    } catch (error) {
        console.log("error",error);
        process.exit(1)
        
    }
}


module.exports=dbconnection