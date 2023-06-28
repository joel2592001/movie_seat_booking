const express = require('express');
const app = express();
const http = require('http');
const { ObjectId } = require('mongodb');
const server = http.createServer(app);
const io = require("socket.io")(server);
const port = 7777;

app.use(express.urlencoded({extended: true}))
app.use(express.json())

var MongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb://127.0.0.1:27017";
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(20);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req,res,next)=>{
    res.append('Acess-Control-Allow-Origin',['*'])
    res.append('Acess-Control-Allow-Methods','GET,PUT,POST,DELETE')
    res.append('Acess-Control-AllowHeaders','Content-Type')
    next();
})

const client = new MongoClient(mongoUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const seat = [
  [1,2,3,4,5,6,7],
  [8,9,10,11,12,13,14],
  [15,16,17,18,19,20],
  [21,22,23,24,25,26]
]

client.connect().then((client) => {
  var db = client.db("booking");
  io.on('connection', (socket) => {
    // console.log('A user connected',socket.id);

    socket.once('fetchData',(res)=>{
      db.collection("seats")
      .findOne({_id:ObjectId("649527fa638b2db2eda4396d")},function(err,result){
          if(err){
            console.log('cant fetch data from db')
          }
          else{
            console.log('useffect fetch')
            io.emit('fetchData',result.data)
          }
      })
    })
    
    socket.once('bookedSeat',(res)=>{
      let fetch_row = res.Index.row
      let fetch_coloum = res.Index.coloum
      let fetch_seat_no = res.seat_no
      let fetch_email = res.user

      // console.log(res.seat_no)
      db.collection('seats')
      .findOne({_id:ObjectId("649527fa638b2db2eda4396d")},function (err, result) {
      // .find({email:feeds_email,order: {$in:[fetch_order]}}).toArray(function (err, result) {
        // console.log(result.data[fetch_row][fetch_coloum])
        if (err) {
            console.log("1 Error: Could not retrieve Shops from DB");
            client.close();
        } else{ 
          if(result.data[fetch_row][fetch_coloum] !== 0){
            console.log('not booked')
            db.collection("seats")
              .updateOne({_id:ObjectId("649527fa638b2db2eda4396d")},{$set:{['data.' + fetch_row +'.'+fetch_coloum]:0}},function (err, result) {
              if (err) {
                  console.log("1 Error: Could not retrieve Shops from DB");
                  client.close();
              } else { 
                db.collection('register')
                .updateOne({email:fetch_email},{$push:{ticket:fetch_seat_no}},function (err, result) {
                  if (err) {
                    console.log("Cant get db values ");
                    client.close();
                  } else {
                    console.log('pushed successfully')
                  }
                })
                
                db.collection("seats")
                .findOne({_id:ObjectId("649527fa638b2db2eda4396d")},function(err,result){
                  if(err){
                    console.log('cant fetch data from db')
                  }
                  else{
                    console.log('seat updated successfully')
                    io.emit('bookedSeat',result.data)
                  }
                })
                socket.emit('message','success')
              }
            })
          }
          else {
            console.log('already booked')
            db.collection("seats")
            .findOne({_id:ObjectId("649527fa638b2db2eda4396d")},function(err,result){
              if(err){
                console.log('cant fetch data from db')
              }
              else{
                console.log('seat updated successfully')
                io.emit('bookedSeat',result.data)
              }
            })
            socket.emit('message','Booked')
          }
        }
        
      })

    })

    socket.once('blockSeat',(res)=>{
      let fetch_row = res.Index.row
      let fetch_coloum = res.Index.coloum

      db.collection("seats")
      .updateOne({_id:ObjectId("649527fa638b2db2eda4396d")},{$set:{['data.' + fetch_row +'.'+fetch_coloum]:0}},function (err, result) {
      if (err) {
          console.log("1 Error: Could not retrieve Shops from DB");
          client.close();
      } else {  

        db.collection("seats")
        .findOne({_id:ObjectId("649527fa638b2db2eda4396d")},function(err,result){
          if(err){
            console.log('cant fetch data from db')
          }
          else{
            console.log('seat updated successfully')
            io.emit('blockSeat',result.data)
            // res.end(JSON.stringify({'data':result.data}))
          }
        })
      }
    })
    })

    socket.once('freeup',(res)=>{
      let fetch_row = res.Index.row
      let fetch_coloum = res.Index.coloum

      db.collection("seats")
      .updateOne({_id:ObjectId("649527fa638b2db2eda4396d")},{$set:{['data.' + fetch_row +'.'+fetch_coloum]:seat[fetch_row][fetch_coloum]}},function (err, result) {
      if (err) {
          console.log("1 Error: Could not retrieve Shops from DB");
          client.close();
      } else {  

        db.collection("seats")
        .findOne({_id:ObjectId("649527fa638b2db2eda4396d")},function(err,result){
          if(err){
            console.log('cant fetch data from db')
          }
          else{
            console.log('seat updated successfully')
            io.emit('freeup',result.data)
            // res.end(JSON.stringify({'data':result.data}))
          }
        })
      }
    })
    })

  })
})

client.connect().then((client) => {
  var db = client.db("booking");
  io.on('connection', (socket) => {


  })
})

  
app.post('/blocktickets',(req,res)=>{
  let fetch_row = req.body.Index.row;
  let fetch_coloum = req.body.Index.coloum;

  const client = new MongoClient(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  client.connect().then((client) => {
    var db = client.db("booking");
    db.collection("seats")
      .updateOne({_id:ObjectId("649527fa638b2db2eda4396d")},{$set:{['data.' + fetch_row +'.'+fetch_coloum]:0}},function (err, result) {
      if (err) {
          console.log("1 Error: Could not retrieve Shops from DB");
          client.close();
      } else {  
        db.collection("seats")
        .findOne({_id:ObjectId("649527fa638b2db2eda4396d")},function(err,result){
          if(err){
            console.log('cant fetch data from db')
          }
          else{
            console.log('seat updated successfully')
            // io.emit('bookedSeat',result.data)
            res.end(JSON.stringify({'data':result.data}))
          }
        })
        socket.emit('message','success')
      }
    })
  })

})

app.post('/usertickets',(req,res)=>{
  let fetch_email = req.body.email
  
  // console.log(fetch_email)

  const client = new MongoClient(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  client.connect().then((client) => {
    var db = client.db("booking");
    db.collection("register")
    .find({email:fetch_email},{projection:{_id:0,ticket:1,name:1}}).toArray(function(err,result){
      if(err){
        console.log('cant fetch data from db')
      }
      else{
        // console.log(result)
        res.end(JSON.stringify({'data':result,'success':'fetched successfully'}))
      }
    })
  })
})

app.post('/register',(req,res)=>{
  let fetch_name = req.body.data.name
  let fetch_email = req.body.data.email
  let fetch_pass = req.body.data.password

  //console.log(req.body.data)
  console.log(fetch_email)
  console.log(fetch_pass)

const client = new MongoClient(mongoUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let email_ref = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let name_ref = /^[^\s]+(\s+[^\s]+)*$/;
let test_field = /^(?!.*\s)(?!null$)(?!undefined$).+$/;
let test_pass = /^(?!.*(?:null|undefined))^.{6,}$/;
let istrue = 0;

if(test_field.test(fetch_email) && test_field.test(fetch_name) && test_field.test(fetch_pass))
{
  istrue += 1
}
else
{
  res.json('Please fill in all details')
}

if(name_ref.test(fetch_name)){
  istrue += 1;
}
else{
    res.json('Four char long and not contain special char');
  //ToastAndroid.show(), ToastAndroid.LONG);
}

if(email_ref.test(fetch_email)){
  istrue +=1;
}
else{
  res.json('Email must be in formate')
}

if (test_pass.test(fetch_pass)){
    istrue +=1;
}
else{
  res.json('password must be 6 char long');
}

if(istrue == 4){
  client.connect().then((client) => {
    var db = client.db("booking");

      db.collection("register")
      .find({email:fetch_email}).toArray(function (err, result) {
          if(result.length > 0) {
            console.log('Email Already Exist')
            console.log(result)
            res.json('Email Already Exist')
          }
          else
          {
            console.log('no')
              //istrue += 1;
            
              db.collection("register")
                  .insertOne({name:fetch_name,email:fetch_email,password:fetch_pass,ticket:[]},function (err, result) {
                  if (err) {
                      console.log("Cant get db values ");
                      client.close();
                  } else {
                      res.json('Registered successfully')
                      console.log(result)
                  }
                })
          }
          //client.close();
      })
    })
}

})

app.post('/login', (req, res) => {
  let fetch_email = req.body.data.email
  let fetch_pass = req.body.data.password

  console.log(req.body.data)
  const client = new MongoClient(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  let email_ref = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let pas_ref = /^(?!.*(?:null|undefined))^.{6,}$/;
  let istrue = 0;

  if((fetch_email == undefined || null) && (fetch_pass == undefined || null))
  {
    res.json('Please fill in all details')
  }
  else if(fetch_pass == undefined)
  {
    res.json('Please fill in all details')
  }

  if(email_ref.test(fetch_email)){
    istrue += 1
  }
  else{
    res.json('Wrong Email or Password')
  }

  if(pas_ref.test(fetch_pass)){
    istrue += 1
  }
  else{
    res.json('Wrong Email or Password')
  }

  console.log(istrue)
  if(istrue == 2){
    client.connect().then((client) => {
      var db = client.db("booking");
        db.collection("register")
        .find({email:fetch_email,password:fetch_pass}).toArray(function (err, result) {
            if(result.length > 0) {
              res.json( 'correct' );
              let hours = new Date().getHours();
              let minutes = new Date().getMinutes();
             
                db.collection("register")
                  .updateOne({email:req.body.data.email},{$set:{time:[hours,minutes]}},function (err, result) {
                  if (err) {
                      console.log("Cant get db values ");
                      client.close();
                  } else {
                      console.log(result)
                      //console.log(mongodb.ObjectID(req.body.data._id))
                  }
                  //client.close();
              })
            
            }
            else{
              console.log('wrong')
              res.json('wrong')
            }
        })
    })
  }
  
})

server.listen(port, () => {
  console.log('Server listening on port', port);
});
