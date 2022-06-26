import { MongoClient, ServerApiVersion} from "mongodb"

let CLIENT = undefined

export async function getMongoDbClient() {
    if (CLIENT) {
        return CLIENT.db()
    }
    const client = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1
    });
    CLIENT = await client.connect()
    return CLIENT.db()
}
