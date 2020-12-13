import { UNiD } from "src"
import { MongoDBClient } from "./adapters/mongodb"
import { MongoDBConnector } from "./connector/mongodb"

(async () => {
    try {
        const client = await MongoDBClient.initialize({
            uri: 'mongodb://root:password@localhost:27017',
        })
        const conn = new MongoDBConnector(client)
        const unid = new UNiD({
            connector: conn,
        })
        const did = await unid.loadDid({
            did: 'did:unid:test:EiDn8meFflBpqoAlcUF3Nmh1TyvJeEygpThWm77HF6zpqg'
        })

        console.log(await did.getIdentifier())

        MongoDBClient.kill()
    } catch (err) {
        console.log(err)
    }
})()