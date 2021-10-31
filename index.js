const express =require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId;
const cors=require('cors');
const app=express();
const port=process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dyxrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database=client.db('wonderWorld');
        const servicesCollection=database.collection('services');
        const bookingCollection=database.collection('booking');

        // POST API to add serivices in DB
        app.post('/services', async(req, res)=>{
           const service=req.body;
           console.log(req.body);
            const result=await servicesCollection.insertOne(service);
            res.send(result);
        })
        // POST booked services
        app.post('/booking', async(req,res)=>{
            const booking=req.body;
            const result=await bookingCollection.insertOne(booking);
            res.send(result);
        })

        // Get API (all services) 
        app.get('/services', async(req,res)=>{
            const result=await servicesCollection.find().toArray();
            res.json(result);
        })
        // GET a single service with id (single services)
        app.get('/services/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const service=await servicesCollection.findOne(query);
            res.send(service);
        })
        // get all booking details
        app.get('/booking', async(req,res)=>{
            const result= await bookingCollection.find().toArray();
            console.log(result);
            res.send(result);
        })
        // Update booking status
        app.put('/booking/:id', async(req,res)=>{
            const id= req.params.id;
            const filter={_id: ObjectId(id)};
            const updateDoc={
                $set:{
                    status: "Confirmed"
                }
            }
            const result= await bookingCollection.updateOne(filter,updateDoc);
            res.json(result);
            console.log(result);
        })
        // Get all booking by a single user
        // app.get('/mybooking/email', async(req,res)=>{
        //     const email=req.params.email;
        //     const query={user: email};
        //     const result= await bookingCollection.find(query).toArray();
        //     res.send(result);
        // })
    }
    finally{
    // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req,res)=>{
    res.send("Server Running");
})


app.listen(port, ()=>{
    console.log("running on port:::", port);
})