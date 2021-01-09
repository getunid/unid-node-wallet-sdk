import { KeyRingType } from "../keyring"
import { AddressCredentialV1 } from "../schemas/address"
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
                '@id'  : DID.getIdentifier(),
                '@type': 'AddressPerson',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: '日本橋',
                },
            }, {
                issuanceDate: new Date(),
                expirationDate: new Date(),
            })
        )

        const signedVP   = await DID.createPresentation([ signedVC ])
        const verifiedVC = await UNiD.verifyCredential(signedVC)

        console.log(verifiedVC)

        const verifiedVP = await UNiD.verifyPresentation(signedVP)

        console.log(verifiedVP)

        MongoDBClient.kill()
    } catch (err) {
        console.log(err)
    }
})()