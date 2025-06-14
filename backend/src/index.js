require("dotenv").config();
const express = require("express");
const app = express();
const redisClient = require("./config/redis")
const database = require("./config/database")
const aiRouter = require("./routes/Aichat")
const voiceRouter = require("./routes/voice")
const cors = require("cors");
const liveRouter = require("./routes/live");

app.use(cors({ origin: "https://negi-bot.vercel.app", credentials: true }));



const  PORT_NO = process.env.PORT_NO
app.use(express.json());
app.use("/chat" , aiRouter)
app.use("/api/voice", voiceRouter);
app.use("/testing", liveRouter);

const initialConnection = async () =>{
    try{
        await Promise.all([
         redisClient.connect(),
         database(),
        ])
        console.log("Databases Connected")

        app.listen(PORT_NO , () =>{
            console.log(`Server is Listening on port no ${PORT_NO}`);
        })

    }catch(err){
        console.log("Error :-  " + err);
    }
}


initialConnection();