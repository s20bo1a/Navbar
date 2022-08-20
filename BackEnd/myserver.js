const express=require('express');
const mysql=require('mysql'); 
const cors = require('cors'); 
const bodyParser=require('body-parser')
const multer=require('multer'); 
const path=require('path'); 

app=express();  
app.use(express.json()); 
app.use(bodyParser.urlencoded({extended :true})); 
app.use('/images',express.static("images"))
app.use(cors());
const db=mysql.createPool({ 
    connectionLimit:12,
 host:'localhost',
 user:'root',
 password:'',
 database:"formtable"

}) 
db.getConnection((err)=>{
 if(err) 
 {
     console.log(err);
 }
 else{
     console.log("connection sucess");
 }
})

// app.get("/",()=>{ 
//  console.log("getting data from db..")
//  const sql='select * from form';
//  db.query(sql,function(err,result){
//   if(err)
//    {
//        console.log(err);
//    }
//    else{
//        console.log(result);
//    }
// }) 
//  app.get("/insert",(req,res)=>{
//     const data=`insert into form (username,password)values('qwe',4556)`;
//      db.query(data,function(err,result){
//          if(err)
//         {
//              console.log(err)
//         }
//         else{
//              console.log("insertion success"); 
//             res.send("Record inserted!");
//         } 

//     })
//  })
    
// }) 

app.post("/delete:regdno",(req,res)=>{ 
  const regdno=req.params.regdno;
var sqldel="delete from register where regdno=?";
  db.query(sqldel,[regdno],function(err,result,fields){

   if(err)throw err;
 else{
   res.send(result); 
   res.end();          
 }

  })


})
 
app.get("/display",(req,res)=>{
   console.log("server is started"); 
   var sql=`select * from register`;
    db.query(sql,function(err,result,fields){

        if(err)throw err;
        else{
//    var resultArray=object.values(JSON.parse(JSON.stringify(result))); 
//   res.send(resultArray);
//     res.end();
       res.send(result);
        }
   
    })
     
    
}) 

app.post("/signup",(req,res)=>{
   const {regdno,username}=req.body.inputs;
const sqlinsert=`insert into register(regdno,username) values(?,?)`;
db.query(sqlinsert,[regdno,username],function(err,data){
  if(err)
  {
    console.log(err);
  } 
  else{
    console.log(data); 
    res.send(data);
    res.end();
  }
})
}) 

app.post("/profile",(req,res)=>{
  console.log("updating....");
 const {regdno,username}=req.body; 
  const sqlupdate="UPDATE `register` SET username=? where regdno=?";
db.query(sqlupdate,[username,regdno],function(err,result){

 if(err)
 {
  console.log(err);
 }
else{
  // console.log(data); 
  res.send(result); 
  res.end();

}});

}); 
// craeting instances for the file storage full control on storing a file int o disk
const  storage=multer.diskStorage({

   destination:(req,file,cb)=>{
    cb(null,'./images');
},
filename:( req,file,cb)=>{ 

  cb(null,file.originalname)
}
    
})
let upload=multer(
  {
    storage:storage ,
    limit:{filesize:100000},
    fileFilter:function(read,file,cb){
      var ext=path.extname(file.originalname);
      if(ext!='.png'&& ext!='.jpg' && ext!='.jpeg' && ext!='.gif')
      {
        return cb("Error!!!")
      }
     cb(null,true)
    }
  
  }
); 
app.post("/upload",upload.single("image"),(req,res)=>{
 if(!req.file)
 {
  console.log("file not found")
 }
 else{ 
  res.send("image uploaded"); 
  console.log(req.file.filename); 
  var url="http://127.0.0.1:5000/images/"+req.file.filename;
let sqlfile="UPDATE `register`  SET image=? where `regdno`=1223";
 db.query(sqlfile,[url],function(err,result)
 { 
  if(err)throw err;
  console.log("file uploaded to database")
 }) 
}
})
app.listen(5000,()=>{
    console.log("server listening!");
})
