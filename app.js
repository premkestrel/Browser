//importing modules
var express=require ('express');
var mongoose=require ("mongoose");
var bodyparser=require ("body-parser");
var cors=require ("cors");
var path=require ("path");

// const uri="mongodb://localhost:27017/browserlist";
const uri="mongodb+srv://user:user@cluster0-iomsi.mongodb.net/test?retryWrites=true&w=majority";
// const uri="mongodb+srv://user:user@cluster0-iomsi.mongodb.net/test?retryWrites=true&w=majority";
const port=process.env.PORT ||3000;
//declaring routes
const route=require("./route/route")
// //connect to mongodb
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);

// mongoose.connect(uri);

// mongoose.connection.on("connected",()=>{
//     console.log("connected to database");
// })
// mongoose.connection.on("error",(err)=>{
//     if(err){
//         console.log("error in connection"+err)
//     }
// })

mongoose
     .connect( uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
     .then(() => console.log( 'Database Connected' ))
     .catch(err => console.log( err ));
var app=express();
//adding middleware
app.use(cors());
//body-parser
app.use(bodyparser.json());
//static files
// app.use(express.static(path.join(__dirname,'public')));

app.use(express.static(path.join(__dirname,'dist')));

// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'dist/client/index.html'));
// })
//routing
app.use("/api",route);
//testing server
app.get("/",(req,res)=>{
    res.send("foobar");
})
//making application to listen to client using port 30000
app.listen(port,()=>{
console.log("server started "+port);
})


