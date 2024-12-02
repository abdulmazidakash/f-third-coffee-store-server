const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) =>{
	res.send('mango server is running server');
})

app.listen(port, (req, res)=>{
	console.log(`mango server is running port: ${port}`);
})