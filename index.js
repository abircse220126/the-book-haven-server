const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
const uri = "mongodb+srv://theBookHaven:bBth3Yyigga90cLf@cluster0.owrghg5.mongodb.net/?appName=Cluster0";


// theBookHaven
// bBth3Yyigga90cLf


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db= client.db("theBookHaven")
    const bookCollection = db.collection("bookCollection")

    
    
    app.get("/books" , async(req , res)=>{
        const cursor = bookCollection.find().limit(6)
        const result = await cursor.toArray()
        res.send(result)
    })


    app.get("/all-books",async(req,res)=>{
        const cursor=bookCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })


    // find a single books using Id
    app.get("/viewdetails/:id" , async(req,res)=>{

      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result= await bookCollection.findOne(query)
      res.send(result)
    })



    // Add Database Related Api
    app.post("/addBook",async(req,res)=>{
      // console.log("hitting the post Api")
      const newUser= req.body
      const result= await bookCollection.insertOne(newUser)

      res.send(result)
    })



    // Delete a Specific book 
    app.delete("/delete-book/:id",async(req , res)=>{
      console.log(req.params)
      const id= req.params.id
      const query = {_id:new ObjectId(id)}
      const result =await bookCollection.deleteOne(query)
      res.send(result) 
    })


    // Update a Book 

    app.patch("/update-book/:id", async(req,res)=>{
      const id= req.params.id
      const updateUser = req.body
      const query = {_id:new ObjectId(id)}
      const update = {
        $set:{
          title: updateUser.title,
          author:updateUser.author,
          genre:updateUser.genre,
          rating:updateUser.rating,
          summary :updateUser.summary
        }
      }
      const result= await bookCollection.updateOne(query , update)
      res.send(result)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/" , (req , res)=>{
    res.send("this is form  server")
})

app.listen(port , ()=>{
    console.log(`the port is ${port}`)
})