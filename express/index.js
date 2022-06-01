const cors = require('cors');
const express = require('express');
const app = express();
const router = express.Router();
app.use(cors());
const port = 3002;

const { MongoClient, ObjectId } = require('mongodb');

// uri string is MongoDB deployment's connection string.
const uri = 'mongodb+srv://User:UserPassword@memes.vyfgc.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

async function upvoteToDB(memeId) {
	try {
		console.log('memeId is ', memeId);
		memeId = new ObjectId(memeId);
		console.log('new memeId is ', memeId);
		await client.connect();
		const database = client.db('Memes');
		const memesCollection = database.collection('Memes');
		//const filter = { _id: memeId };
		//const update = { $inc: { upvotes: 1 } };
		//const update = { $set: { upvotes: 'upvoted' } };
		// const vote = await memesCollection.findOneAndUpdate(filter, update);
		const vote = await memesCollection.findOneAndUpdate(
			{ _id: memeId },
			{ $inc: { upvotes: 1 } },
			// { new: true },
			{ returnDocument: 'after' }
		);
		//.toArray();
		console.log('vote is: ---', vote);
		return vote;
	} finally {
		// Ensures that the client will close when you finish/error
		//await client.close();
	}
}

async function downvoteToDB(memeId) {
	try {
		console.log('memeId is ', memeId);
		memeId = new ObjectId(memeId);
		console.log('new memeId is ', memeId);
		await client.connect();
		const database = client.db('Memes');
		const memesCollection = database.collection('Memes');
		//const filter = { _id: memeId };
		//const update = { $inc: { upvotes: 1 } };
		//const update = { $set: { upvotes: 'upvoted' } };
		// const vote = await memesCollection.findOneAndUpdate(filter, update);
		const vote = await memesCollection.findOneAndUpdate(
			{ _id: memeId },
			{ $inc: { downvotes: -1 } },
			// { new: true },
			{ returnDocument: 'after' }
		);
		//.toArray();
		console.log('vote is: ---', vote);
		return vote;
	} finally {
		// Ensures that the client will close when you finish/error
		//await client.close();
	}
}

async function addToDB(memeData) {
	try {
		console.log('memeData is ', memeData);
		await client.connect();
		const database = client.db('Memes');
		const memesCollection = database.collection('Memes');
		const insert = await memesCollection.insertOne({
			url: memeData.url,
			name: memeData.name,
			upvotes: 0,
			downvotes: 0,
		});
	} finally {
		// Ensures that the client will close when you finish/error
		//await client.close();
		setTimeout(() => {
			client.close();
		}, 1500);
	}
}

async function giveMemes(num) {
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

var bodyParser = require('body-parser');

app.use(bodyParser());

app.get('/1', (req, res) => {
	//console.log(req);
	async function getURL() {
		const result = await giveMemes(1);
		//console.log(result);
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.json(result);
	}
	getURL();
});

app.get('/10', (req, res) => {
	//console.log(req.body);
	async function getURL() {
		const result = await giveMemes(10);
		//console.log(result);
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.json(result);
	}
	getURL();
});

app.post('/upvote', (req, res) => {
	if (req.body.vote === 1) {
		console.log('upvote sent to database, ----', req.body.id);
		const vote = upvoteToDB(req.body.id);
		async function postConfirm() {
			const confirmMessage = { message: 'upvote received', newVote: (await vote).value.upvotes };
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.json(confirmMessage);
		}
		postConfirm();
	} else {
		console.log('upvote fail');
	}
});

app.post('/downvote', (req, res) => {
	if (req.body.vote === -1) {
		console.log('downvote sent to database, ----', req.body.id);
		const vote = downvoteToDB(req.body.id);
		async function postConfirm() {
			const confirmMessage = { message: 'downvote received', newVote: (await vote).value.downvotes };
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.json(confirmMessage);
		}
		postConfirm();
	} else {
		console.log('downvote fail');
	}
});

app.post('/add', (req, res) => {
	async function postConfirm() {
		const confirmMessage = { message: 'meme received' };
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.json(confirmMessage);
	}
	postConfirm();
	if (req.body.length != 0) {
		console.log('meme sent to database', req.body);
		addToDB(req.body);
	}
});

app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});
