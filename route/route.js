const axios = require('axios');
const express=require ('express');
const router=express.Router();
const list=require("../models/lists");
const request = require("request")
//to check login
router.post("/login",(req,res)=>{
var queryu = { username: req.body.username };
var query = { username: req.body.username ,password:req.body.password};

list.find(queryu,(err,data)=>{
  if(data.length!=0){
    list.find(query,(err,data)=>{
      if(data.length!=0){
    res.send({msg:"valid credential",value:"1"})
      }else{
        res.send({msg:"invalid password",value:"0"})
      }
    })
  }else{
    res.send({msg:"You are not Registered",value:"-1"})
  }
})
 
})

//to fetch result from google based on query
router.post('/list',(req,res,next)=>{
  const params = {
  access_key: "74e602f8fb7b3279338f8cc09a718dc6",
  query: req.body.keyword
}
let val1=[];
var query = { username: req.body.username ,password:req.body.password,keyword:req.body.keyword};

    //find to check whether keyword matches any already stored value
list.find(query,(err,data)=>{
   if(data.length!=0){
     for(let i of data[0].datas){
      val1.push({"title":i.title,"url":i.url,"snippet":i.snippet});
    }
   
   }
})

axios.get('http://api.serpstack.com/search', {params})
  .then(response => {
    const apiResponse = response.data;
      //adding unique element to val1
      response.data.organic_results.forEach(function(value) {
        var existing =val1.filter(function(v, i) {
            return (v.title == value.title);
        });
        if (existing.length==0) {
             val1.push({"title":value.title,"url":value.url,"snippet":value.snippet})
        } 
    });
      res.send({value:val1,error:null,st:1})
  }).catch(error => {
    if(val1.length!=0){
      res.send({value:val1,error:"check your internet connection",st:0})
    }else{
      res.send({value:null,error:"check your internet connection",st:-1})
    }
  });
})


router.put("/add",(req,res)=>{


  var query = { username: req.body.username ,password:req.body.password};
var skip=0;
    //find to check whether keyword matches any already stored value
list.find(query,(err,data)=>{
   if(data.length!=0){
     if(data[0].keyword==null){
    var myquery = {  username: req.body.username ,password:req.body.password};
    var newvalues = { $set: {username: req.body.username ,password:req.body.password,keyword:req.body.keyword,datas:req.body.datas} };
    list.updateOne(myquery, newvalues,(err,result)=>{
        if(err){
            res.json({msg:"failed to add your list"});
        }else{
          res.json({msg:"successfully list is added"});
        }
    })

     }else{
       let query1={ username: req.body.username ,password:req.body.password,keyword:req.body.keyword}
      list.find(query1,(err,data)=>{
        if(data.length!=0){
          let dblist=data[0].datas;//datas from db
//checking whether req title already in db
dblist.forEach(i=>{
  if(i.title==req.body.datas[0]["title"]){
    // console.log(i.title+" "+req.body.datas.title)
    skip=1;
    res.json({msg:"link is already in your favourite"});
  }
})
if(skip==0){
          req.body.datas.forEach(i=>{
            dblist.unshift(i);
          })
         
          var newvalues = { $set: {username: req.body.username ,password:req.body.password,keyword:req.body.keyword,datas:dblist} };
    list.updateOne(query1, newvalues,(err,result)=>{
        if(err){
            res.json({msg:"failed to add your link"});
        }else{
          res.json({msg:"successfully link is added to your favourite"});
        }
    })
  }
      }else{
            let newlist=new list({
    username:req.body.username,
    password:req.body.password,
    keyword:req.body.keyword,
    datas:req.body.datas
  })
  newlist.save((err,result)=>{
      if(err){
          res.json({msg:"failed to add your link"});
      }else{
          res.json({msg:"successfully link is added to your favourite"});
      }
  })
        }
     })
    
 
     
     }   
   }
})
})
router.post("/register",(req,res)=>{
let flag=0;
  var query = { username: req.body.username};
list.find(query,(err,data)=>{
   if(data.length!=0){
   res.json({msg:"username already exist",value:"0"})
   }else{
    let newlist=new list({
      username:req.body.username,
      password:req.body.password,
      keyword:null,
      datas:[]
    })
    newlist.save((err,result)=>{
        if(err){
            res.json({msg:err});
        }else{
                res.json({msg:"successfully registered!",value:"1"});
        }
    })
   }
})
})

module.exports=router;