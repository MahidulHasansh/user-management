const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3005;


// connect with middleware
app.use(cors());
app.use(express.json());





// initial server Run
app.get('/', (req, res) => {
    res.send('User Management Server Is Runing....');
});

app.listen(port, () => {
    console.log(`The App Is running On Port < ${port}`);
});






const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_key}@cluster0.vnqo6jg.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // database 
        const userDB = client.db("Usermanagement").collection("userInfo");

        // post server
        app.post('/users', async (req, res) => {
            const userInfo = req.body;
            const result = await userDB.insertOne(userInfo);
            res.send(result);
        });


        // get server
        app.get('/users', async (req, res) => {
            const userData = userDB.find();
            const result = await userData.toArray();
            res.send(result);
        });
        app.get('/users/:id', async (req, res) => {
            const userId = req.params.id;
            const query = { _id: new ObjectId(userId) };
            const result = await userDB.findOne(query);
            res.send(result);
        });


        // update server
        app.put('/users/:id', async (req, res) => {
            const userId = req.params.id;
            const updatedData = req.body;
            const filter = { _id: new ObjectId(userId) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    username: updatedData.username,
                    useremail: updatedData.useremail,
                    usergender: updatedData.usergender,
                    userstatus: updatedData.userstatus,
                },
            };
            const result = await userDB.updateOne(filter, updateDoc, options);
            res.send(result);
        });


        // delete serer
        app.delete('/users/:id', async (req, res) => {
            const userId = req.params.id;
            const query = { _id: new ObjectId(userId) };
            const result = await userDB.deleteOne(query);
            res.send(result);
        });



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// Export the Express API
module.exports = app;
