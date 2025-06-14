const express = require("express");
const aiRouter = express.Router();
const  askAi   = require("../controller/Ai");


aiRouter.post("/ask" , askAi)
module.exports = aiRouter;