import {
    UNiD,
    MongoDBClient,
    MongoDBConnector,
    KeyRingType,
    AddressCredentialV1,
} from '../src'

beforeAll(() => {
    return new Promise(async (resolve, reject) => {
        const client = await MongoDBClient.initialize({
            uri: 'mongodb://root:password@localhost:27017',
        })
        const connector = new MongoDBConnector({
            client: client,
        })
        UNiD.init({
            clientId    : '718AC7F1006ECA672E1D1BE9B4666D3EEFD6C2805F9200328502853AFDFD3219',
            clientSecret: '670E362C65183C3850A8FC6E0ED26EC72FDAE67846FDCE1904F604C8E4757273',
            connector   : connector,
        })

        return resolve(true)
    })
})

afterAll(() => {
    return new Promise(async (resolve, reject) => {
        await MongoDBClient.kill()

        return resolve(true)
    })
})

test('SDS - 1', async () => {
    const DID      = await UNiD.createDid(KeyRingType.Mnemonic)
    const signedVC = await DID.createCredential(
        new AddressCredentialV1({
            '@id'  : DID.getIdentifier(),
            '@type': 'AddressPerson',
            address: {
                '@type': 'PostalAddress',
                streetAddress: '日本橋',
            },
        })
    )

    const signedVP   = await DID.createPresentation([ signedVC ])
    const verifiedVC = await UNiD.verifyCredential(signedVC)
    const verifiedVP = await UNiD.verifyPresentation(signedVP)

    expect(verifiedVC.isValid).toEqual(true)
    expect(verifiedVP.isValid).toEqual(true)

    const filterd = AddressCredentialV1.select(verifiedVP.payload)

    expect(filterd).not.toBeUndefined()

    if (filterd) {
        const address = await UNiD.verifyCredential(filterd)

        expect(address.isValid).toEqual(true)
    }

    await DID.postCredential(verifiedVC)
})