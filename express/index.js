const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
const port = 3001;

const { MongoClient } = require('mongodb');

// uri string is MongoDB deployment's connection string.
const uri = 'mongodb+srv://User:UserPassword@memes.vyfgc.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

async function run(num) {
	try {
		await client.connect();
		const database = client.db('Memes');
		const memesCollection = database.collection('Memes');

		// Get random record from collection.
		const memes = await memesCollection
			.aggregate([
				{ $match: { url: { $exists: true } } }, //ommits documents without url field
				{ $sample: { size: num } },
			])
			.toArray();

		const objectURL = { memes };

		return objectURL;
	} finally {
		// Ensures that the client will close when you finish/error
		await client.close();
	}
}

app.get('/1', (req, res) => {
	//console.log(req);
	async function getURL() {
		const result = await run(1);
		console.log(result);
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.json(result);
	}
	getURL();
});

app.get('/10', (req, res) => {
	//console.log(req);
	async function getURL() {
		const result = await run(10);
		console.log(result);
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.json(result);
	}
	getURL();
});

app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});
