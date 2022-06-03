const cors = require('cors');
const express = require('express');
const app = express();
const router = express.Router();
app.use(cors());
const port = 3002;

//--------------------------------------------------------------------------------------
//MONGO

const { MongoClient, ObjectId } = require('mongodb');

// uri string is MongoDB deployment's connection string.
const uri = 'mongodb+srv://User:UserPassword@memes.vyfgc.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

async function upvoteToDB(memeId, voteValue) {
	try {
		memeId = new ObjectId(memeId);
		await client.connect();
		const database = client.db('Memes');
		const memesCollection = database.collection('Memes');
		const vote = await memesCollection.findOneAndUpdate(
			{ _id: memeId },
			{ $inc: { upvotes: voteValue } },
			{ returnDocument: 'after' }
		);
		return vote;
	} finally {
		//client.close();
	}
}

async function downvoteToDB(memeId, voteValue) {
	try {
		memeId = new ObjectId(memeId);
		await client.connect();
		const database = client.db('Memes');
		const memesCollection = database.collection('Memes');
		const vote = await memesCollection.findOneAndUpdate(
			{ _id: memeId },
			{ $inc: { downvotes: voteValue } },
			{ returnDocument: 'after' }
		);
		return vote;
	} finally {
		//client.close();
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
		//client.close();
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
		//client.close();
	}
}

async function giveHotMemes(num) {
	const memes = { memes: [] };
	try {
		await client.connect();
		const database = client.db('Memes');
		const memesCollection = database.collection('Memes');
		const pipeline = [{ $match: { upvotes: { $gt: 5 } } }, { $sample: { size: num } }];
		const aggCursor = memesCollection.aggregate(pipeline);
		for await (const doc of aggCursor) {
			memes.memes.push(doc);
		}
		return memes;
	} finally {
		//client.close();
	}
}

//--------------------------------------------------------------------------------------
//GET and POST requests

app.use(express.json());

app.get('/1', (req, res) => {
	async function sendMemes() {
		const result = await giveMemes(1);
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.json(result);
	}
	sendMemes();
});

app.get('/3', (req, res) => {
	async function sendMemes() {
		const result = await giveMemes(3);
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.json(result);
	}
	sendMemes();
});

app.get('/hot/1', (req, res) => {
	async function sendMemes() {
		const result = await giveHotMemes(1);
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.json(result);
	}
	sendMemes();
});

app.get('/hot/3', (req, res) => {
	async function sendMemes() {
		const result = await giveHotMemes(3);
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.json(result);
	}
	sendMemes();
});

app.post('/upvote', (req, res) => {
	if (req.body.vote === 1 || req.body.vote === -1) {
		const vote = upvoteToDB(req.body.id, req.body.vote);
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
	if (req.body.vote === 1 || req.body.vote === -1) {
		const vote = downvoteToDB(req.body.id, req.body.vote);
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
		addToDB(req.body);
	}
});

app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});
