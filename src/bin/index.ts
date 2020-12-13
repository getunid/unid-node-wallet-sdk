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
            did: 'did:unid:test:EiDn8meFflBpqoAlcUF3Nmh1TyvJeEygpThWm77HF6zpqg'
        })
        const did = await DID.getIdentifier()

        console.log('did =', did)

        MongoDBClient.kill()
    } catch (err) {
        console.log(err)
    }
})()