import { Cipher } from "src/cipher/cipher"
import { KeyRingType } from "src/keyring"
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

        const DID = await UNiD.createDid(KeyRingType.Mnemonic)

        const signedVC = await DID.createCredential(
            new AddressCredentialV1({
                type: [ 'VerifiableCredential', 'AddressPerson' ],
                credentialSubject: {
                    '@id'  : DID.getIdentifier(),
                    '@type': 'AddressPerson',
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: '北柏 3 - 18 - 15',
                    },
                }
            }, {
                issuanceDate: new Date(),
                expirationDate: new Date(),
            })
        )

        const encrypted = await Cipher.encrypt(Buffer.from(JSON.stringify(signedVC), 'utf-8'), Buffer.from('password'))

        console.log(encrypted.toString('base64'))

        MongoDBClient.kill()
    } catch (err) {
        console.log(err)
    }
})()