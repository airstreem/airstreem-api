import { MongoClient, ServerApiVersion} from "mongodb"

let CLIENT = null

export async function getMongoDbClient() {
    if (CLIENT != null) {
        return CLIENT
    }
    const client = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1
    });
    CLIENT = await client.connect()
    return CLIENT.db()
}
