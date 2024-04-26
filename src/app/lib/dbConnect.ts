import mongoose
from "mongoose";


type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

export async function dbConnect (): Promise<void>{

    if(connection.isConnected){
        console.log("already connected to dataabse")
        return;
    }
    try {
     const db =     await mongoose.connect(process.env.MONGODB_URI || '',{})
     console.log(db)
    connection.isConnected =  db.connections[0].readyState
    console.log("Db connected successfully")
    } catch (error) {
        console.log("database connection faiiled",error)
        process.exit(1);
    }
}