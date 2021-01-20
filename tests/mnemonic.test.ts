import {
    UNiD,
    MongoDBClient,
    MongoDBConnector,
    KeyRingType,
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
            clientId     : '718AC7F1006ECA672E1D1BE9B4666D3EEFD6C2805F9200328502853AFDFD3219',
            clientSecret : '670E362C65183C3850A8FC6E0ED26EC72FDAE67846FDCE1904F604C8E4757273',
            encryptionKey: '1AFFD4C6096D0EF4344E963612229DBF786BBC23C60611093FA9149C0E815E68',
            connector    : connector,
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

test('Mnemonic - 1', async () => {
    const DID1 = await UNiD.createDid(KeyRingType.Mnemonic)
    const DID2 = await UNiD.loadDid({ did: DID1.getIdentifier() })

    expect(DID1.getSeedPhrase()).toEqual(DID2.getSeedPhrase())

    const mnemonic1 = DID1.getSeedPhrase()

    if (mnemonic1 !== undefined) {
        expect(await DID2.verifySeedPhrase(mnemonic1)).toEqual(true)
        expect(DID2.getSeedPhrase()).toBeUndefined()
    }

    const DID3 = await UNiD.loadDid({ did: DID1.getIdentifier() })

    const mnemonic2 = DID3.getSeedPhrase()

    expect(mnemonic2).toBeUndefined()
})