// import { KeyRingType } from "src/keyring"
import { UNiD } from ".."
import { MongoDBClient } from "../adapters/mongodb"
import { MongoDBConnector } from "../connector/mongodb"

(async () => {
    try {
        const client = await MongoDBClient.initialize({
            uri: 'mongodb://root:password@localhost:27017',
        })
        const connector = new MongoDBConnector({
            client: client,
        })
        UNiD.init({
            clientId    : 'CLIENT_ID',
            clientSecret: 'CLIENT_SECRET',
            connector   : connector,
        })

        const DID = await UNiD.loadDid({
            did: 'did:unid:test:EiBtzgWy130lNOyO3JsHkR75YFeSgU7h4p6zYvfQxrAXeA',
        })

        console.log(DID.getIdentifier())
        console.log(DID.getSeedPhrase())
        console.log(JSON.stringify(await DID.getDidDocument(), null, 2))

        MongoDBClient.kill()
    } catch (err) {
        console.log(err)
    }
})()