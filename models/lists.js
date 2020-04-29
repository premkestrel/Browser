//schema
const mongoose=require ("mongoose");

const listSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    keyword:{
        type:String,
        // required:true
    }, datas:{
        type:Array
    }
 
});
const contact=module.exports=mongoose.model("list",listSchema);