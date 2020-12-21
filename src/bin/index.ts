// import { KeyRingType } from "src/keyring"
import { Cipher } from "src/cipher/cipher"
import { AddressCredentialV1 } from "src/schemas/address"
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

        const signedCred = await DID.createCredential(
            new AddressCredentialV1({
                type: [ 'VerifiableCredential', 'AddressPerson' ],
                credentialSubject: {
                    '@id': '',
                    '@type': 'AddressPerson',
                    address: {
                        '@type': 'PostalAddress',
                    }
                },
            }, {
                // issuanceDate  : new Date(), // Optional (default: NOW())
                // expirationDate: new Date(), // Optional
            })
        )

        const encrypted = await Cipher.encrypt(Buffer.from(JSON.stringify(signedCred), 'utf-8'), Buffer.from('password'))

        console.log(encrypted.toString('base64'))

        MongoDBClient.kill()
    } catch (err) {
        console.log(err)
    }
})()