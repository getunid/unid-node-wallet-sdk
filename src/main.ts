import { UNiD } from "src"
import { MongoDBClient } from "./adapters/mongodb"
import { MongoDBConnector } from "./connector/mongodb"
import { KeyRingType } from "./keyring"

(async () => {
    const client = await MongoDBClient.initialize({
        uri: 'mongodb://root:password@localhost:27017',
    })
    const conn = new MongoDBConnector(client)
    const unid = new UNiD({
        connector: conn,
    })
    await unid.createDidDocument(KeyRingType.Mnemonic)

    console.log(unid)
})()