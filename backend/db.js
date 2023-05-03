import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todos';
const MONGO_DB = process.env.MONGO_DB || 'todos';

let db = null;
let collection = null;
export default class DB {
    connect() {
        return MongoClient.connect(MONGO_URI)
            .then(function (client) {
                db = client.db(MONGO_DB);
                collection = db.collection('todos');
            })
    }

    queryAll() {
        return collection.find().toArray();
    }

    queryById(id) {
        const mongoId = new ObjectId(id);
        let query = {"_id" : mongoId};
        return collection.findOne(query);
    }

    update(id, order) {
        const mongoId = new ObjectId(id);
        let query = {"_id" : mongoId};
        return collection.updateOne(query, {$set: order});
    }

    delete(id) {
        const mongoId = new ObjectId(id);
        let query = {"_id" : mongoId};
        return collection.deleteOne(query);
    }

    insert(order) {
        return collection.insertOne(order);
    }
}
