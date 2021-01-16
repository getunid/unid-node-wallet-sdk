import {
    UNiD,
    MongoDBClient,
    MongoDBConnector,
    KeyRingType,
    AddressCredentialV1,
    PhoneCredentialV1,
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

test('UNiD - 1', async () => {
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
})

test('UNiD - 2', async () => {
    const text = '{"proof":{"type":"EcdsaSecp256k1Signature2019","proofPurpose":"authentication","created":"2021-01-13T21:11:15Z","verificationMethod":"did:unid:test:EiC_zQUAMqEKWjr6Q8rAFVHdrO7xLgm0FGVx7U7eIbcNaA","jws":"eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..a6UxqwWske5O9Bi-2JdViZVrxaM4JyjerFtPhOQdNnkx3UMRArBYG21wBHTyYzfxD7amJ1KiVhHVOyFQbTvz5w"},"id":"https://sds.getunid.io/api/v1","issuer":"did:unid:test:EiC_zQUAMqEKWjr6Q8rAFVHdrO7xLgm0FGVx7U7eIbcNaA","issuanceDate":"2021-01-13T21:11:15Z","@context":["https://www.w3.org/2018/credentials/v1","https://docs.getunid.io/docs/2020/credentials/address"],"type":["VerifiableCredential","AddressCredentialV1"],"credentialSubject":{"@id":"did:unid:test:EiC_zQUAMqEKWjr6Q8rAFVHdrO7xLgm0FGVx7U7eIbcNaA","@type":"AddressPerson","address":{"@type":"PostalAddress","streetAddress":"日本橋"}},"expirationDate":"2021-01-13T21:11:15Z"}'
    const json = JSON.parse(text)

    expect(UNiD.isVerifiableCredential(json)).toEqual(true)
    expect(UNiD.isVerifiablePresentation(json)).toEqual(false)

    if (UNiD.isVerifiableCredential(json)) {
        const credential = await UNiD.verifyCredential(json)

        expect(credential.isValid).toEqual(true)
    }
})

test('UNiD - 3', async () => {
    const text = '{"proof":{"type":"EcdsaSecp256k1Signature2019","proofPurpose":"authentication","created":"2021-01-13T21:11:15Z","verificationMethod":"did:unid:test:EiC_zQUAMqEKWjr6Q8rAFVHdrO7xLgm0FGVx7U7eIbcNaA","jws":"eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..KrGHU5hGQ5TL4K2Mt4N16mzByXojyGNnITOcG4abm7YcA2ehFi4m1G8LKbZJdzQ-iX6PTcjiYhk34xxbu684og"},"id":"https://sds.getunid.io/api/v1","issuer":"did:unid:test:EiC_zQUAMqEKWjr6Q8rAFVHdrO7xLgm0FGVx7U7eIbcNaA","issuanceDate":"2021-01-13T21:11:15Z","@context":["https://www.w3.org/2018/credentials/v1"],"type":["VerifiablePresentation"],"verifiableCredential":[{"proof":{"type":"EcdsaSecp256k1Signature2019","proofPurpose":"authentication","created":"2021-01-13T21:11:15Z","verificationMethod":"did:unid:test:EiC_zQUAMqEKWjr6Q8rAFVHdrO7xLgm0FGVx7U7eIbcNaA","jws":"eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..a6UxqwWske5O9Bi-2JdViZVrxaM4JyjerFtPhOQdNnkx3UMRArBYG21wBHTyYzfxD7amJ1KiVhHVOyFQbTvz5w"},"id":"https://sds.getunid.io/api/v1","issuer":"did:unid:test:EiC_zQUAMqEKWjr6Q8rAFVHdrO7xLgm0FGVx7U7eIbcNaA","issuanceDate":"2021-01-13T21:11:15Z","@context":["https://www.w3.org/2018/credentials/v1","https://docs.getunid.io/docs/2020/credentials/address"],"type":["VerifiableCredential","AddressCredentialV1"],"credentialSubject":{"@id":"did:unid:test:EiC_zQUAMqEKWjr6Q8rAFVHdrO7xLgm0FGVx7U7eIbcNaA","@type":"AddressPerson","address":{"@type":"PostalAddress","streetAddress":"日本橋"}},"expirationDate":"2021-01-13T21:11:15Z"}]}'
    const json = JSON.parse(text)

    expect(UNiD.isVerifiableCredential(json)).toEqual(false)
    expect(UNiD.isVerifiablePresentation(json)).toEqual(true)

    if (UNiD.isVerifiablePresentation(json)) {
        const presentation = await UNiD.verifyPresentation(json)

        expect(presentation.isValid).toEqual(true)

        const phone   = PhoneCredentialV1.select(presentation.payload)
        const address = AddressCredentialV1.select(presentation.payload)

        expect(phone).toBeUndefined()
        expect(address).not.toBeUndefined()

        if (address) {
            const credential = await UNiD.verifyCredential(address)

            expect(credential.isValid).toEqual(true)
        }
    }
})

test('UNiD - 4', async () => {
    const text = '{}'
    const json = JSON.parse(text)

    await expect(async () => {
        await UNiD.verifyCredential(json)
    }).rejects.toThrow('[code: 400]')
})

test('UNiD - 5', async () => {
    const text = '{}'
    const json = JSON.parse(text)

    await expect(async () => {
        await UNiD.verifyPresentation(json)
    }).rejects.toThrow('[code: 400]')
})