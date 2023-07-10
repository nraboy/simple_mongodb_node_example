const { MongoClient, ObjectId } = require("mongodb");
const Express = require("express");
const BodyParser = require("body-parser");

require("dotenv").config();

const app = Express();

app.use(BodyParser.json());

const mongoClient = new MongoClient(process.env.MONGODB_ATLAS_URI);
var database, collection;

app.get("/episodes", async (request, response, next) => {
    try {
        let results = await collection.find({}).toArray();
        response.send(results);
    } catch (error) {
        response.status(500).send({ "message": error.message });
    }
});

app.post("/episode", async (request, response, next) => {
    try {
        let data = request.body;
        let result = await collection.insertOne(data);
        response.send(result);
    } catch (error) {
        response.status(500).send({ "message": error.message });
    }
});

app.put("/episode/:id", async (request, response, next) => {
    try {
        let id = request.params.id;
        let data = request.body;
        let result = await collection.updateOne(
            { "_id": new ObjectId(id) },
            {
                "$set": data
            }
        );
        response.send(result);
    } catch (error) {
        response.status(500).send({ "message": error.message });
    }
});

app.delete("/episode/:id", async (request, response, next) => {
    try {
        let id = request.params.id;
        let result = await collection.deleteOne({ "_id": new ObjectId(id) });
        response.send(result);
    } catch (error) {
        response.status(500).send({ "message": error.message });
    }
});

app.listen(3000, async() => {
    await mongoClient.connect();
    database = mongoClient.db("mongodbtv");
    collection = database.collection("episodes");
    console.log("Listening at :3000");
});