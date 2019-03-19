const express = require("express")
const router = express.Router()
const {DateTime} = require('luxon')

router.get("/list",async (req,res)=>{
  const app=require("../app")
  const service=app.service('schedule')
  const today=DateTime.local()
  const f1=await service.find({query:{date: today.toFormat("yyyyLLdd"),
resource: "Arzt"}})
  res.render("termin",{title: "Termin",
slots: f1, tdate: today.toFormat("dd.LL.yyyy")})
})
module.exports=router
