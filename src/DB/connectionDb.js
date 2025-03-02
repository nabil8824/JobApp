import mongoose from "mongoose";

 const connectionDB= async()=>{
  await  mongoose.connect(process.env.URI_CONNECTION)
  .then(()=>{
    console.log("connected to mongodb",process.env.URI_CONNECTION);
    
  }).catch((err)=>{
    console.log(" error connection to mongodb",err);
    
})
}

export default connectionDB;