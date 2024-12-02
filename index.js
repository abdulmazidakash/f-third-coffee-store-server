const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j0hxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




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

	const mangoCollection = client.db('mangoDB').collection('mango');

	//users collection data client
	const userCollection = client.db('mangoDB').collection('users');

	app.get('/mango', async(req, res) =>{
		const cursor = mangoCollection.find();
		const result = await cursor.toArray();
		res.send(result);
	})

	app.get('/mango/:id', async(req, res) =>{
		const id = req.params.id;
		const query = {_id: new ObjectId(id)};
		const result = await mangoCollection.findOne(query);
		res.send(result);
	})

	app.post('/mango', async(req, res) =>{
		const newCoffee = req.body;
		console.log(newCoffee);
		const result = await mangoCollection.insertOne(newCoffee);
		res.send(result);
	})
	
	app.put('/mango/:id', async(req, res) =>{
		const id = req.params.id;
		const filter = {_id: new ObjectId(id)};
		const options = {upsert: true};
		const updatedCoffee = req.body;

		const coffee = {
			$set: {
				name: updatedCoffee.name, 
				chef: updatedCoffee.chef, 
				supplier: updatedCoffee.supplier, 
				taste: updatedCoffee.taste, 
				category: updatedCoffee.category, 
				details: updatedCoffee.details, 
				photo: updatedCoffee.photo
			}
		}
		const result = await mangoCollection.updateOne(filter, coffee, options);
		res.send(result);
	})

	app.delete('/mango/:id', async(req, res)=>{
		const id = req.params.id;
		const query = {_id: new ObjectId(id)};
		const result = await mangoCollection.deleteOne(query);
		res.send(result);
	})

	//users related apis 

	app.get('/users', async(req, res) =>{
		const cursor = userCollection.find();
		const result = await cursor.toArray();
		res.send(result);
	})
	app.post('/users/', async(req, res)=>{
		const newUser = req.body;
		console.log(newUser);
		const result = await userCollection.insertOne(newUser);
		res.send(result);
	});

	app.patch('/users', async(req, res)=>{
		const email = req.body.email;
		const filter = {email};
		const updatedDoc = {
			$set:{
				lastSignInTime: req.body?.lastSignInTime
			}
		}
		const result = await userCollection.updateOne(filter, updatedDoc);
		res.send(result);
	})


	app.delete('/users/:id', async(req, res)=>{
		const id = req.params.id;
		const query = {_id: new ObjectId(id)};
		const result = await userCollection.deleteOne(query);
		res.send(result);
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



app.get('/', (req, res) =>{
	res.send('mango server is running server');
})

app.listen(port, (req, res)=>{
	console.log(`mango server is running port: ${port}`);
})