import mongoose from 'mongoose';
import {app} from "./app";

const startDbConnection = async () => {
    console.log('starting');
    if(!process.env.JWT_KEY) {
        throw  new Error("JWT_KEY must be defined!")
    }
    if(!process.env.MONGO_URI) {
        throw  new Error("MONGO_URI must be defined!")
    }
    try{
        await mongoose.connect(process.env.MONGO_URI);
    }catch(e) {
        console.log(e);
    }
}

app.all("/test", (req, res) => {
    res.send('hi there !! test')
})

app.listen(3000, () => {
    console.log('Listening on PORT 3000')
    startDbConnection().then(() => {
        console.log("Database Connected")
    });
})