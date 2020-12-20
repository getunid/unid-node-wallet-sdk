import { Signer, Jws, CredentialSigner } from '../src/cipher/signer'
import { Secp256k1 as Context } from '../src/keyring/secp256k1'
import { UNiDVC } from '../src/did/credential'
import { AddressCredentialV1 } from '../src/schemas/address'
import secp256k1 from 'secp256k1'
import { DateTimeTypes, DateTimeUtils } from '../src/utils/datetime'

const DID: string = 'did:unid:test:EiBtzgWy130lNOyO3JsHkR75YFeSgU7h4p6zYvfQxrAXeA'
const XY: Buffer = Buffer.from('04da5cd2e20091a7e030905c495241ca5ede8f1e2b2a04c3c628f0335986317c246621aed82210ed73daf5222682a4acd87f2d42a42cb1834fccd36ed3bb555092', 'hex')
const D : Buffer = Buffer.from('4c5bb19b5c17a065253be083a49930fbd91473c60f7359389e2b280b5cbafc9e', 'hex')

test('Signer - 1', async () => {
    expect(true).toEqual(secp256k1.publicKeyVerify(Uint8Array.from(XY)))
    expect(true).toEqual(secp256k1.privateKeyVerify(Uint8Array.from(D)))

    const context = new Context({
        public : XY,
        private: D,
    })

    expect(true).toEqual(context.validatePoint())

    const payload = {
        id: 'did:self:0x0123456789012345678901234567890123456789'
    }
    const message   = JSON.stringify(payload)
    const signature = await Signer.sign(Buffer.from(message, 'utf-8'), context)
    const verified  = await Signer.verify(Buffer.from(message, 'utf-8'), signature, context)

    expect(true).toEqual(verified)
})

test('Signer - 2', async () => {
    expect(true).toEqual(secp256k1.publicKeyVerify(Uint8Array.from(XY)))
    expect(true).toEqual(secp256k1.privateKeyVerify(Uint8Array.from(D)))

    const context = new Context({
        public : XY,
        private: D,
    })

    expect(true).toEqual(context.validatePoint())

    const myObject = {
        test: 'ok',
    }

    const jws      = await Jws.encode(myObject, context)
    const verified = await Jws.verify(myObject, jws, context)

    expect(true).toEqual(verified)
})

test('Signer - 3', async () => {
    expect(true).toEqual(secp256k1.publicKeyVerify(Uint8Array.from(XY)))
    expect(true).toEqual(secp256k1.privateKeyVerify(Uint8Array.from(D)))

    const context = new Context({
        public : XY,
        private: D,
    })

    expect(true).toEqual(context.validatePoint())

    const myObject: { test: string } = {
        test: 'ok',
    }

    const document = await CredentialSigner.sign<{ test: string }>(myObject, {
        did    : DID,
        context: context,
    })
    const verified = await CredentialSigner.verify<{ test: string }>(document, {
        context: context,
    })

    expect(true).toEqual(verified.isValid)
    expect({ test: 'ok' }).toEqual(verified.payload)
})

test('Signer - 4', async () => {
    expect(true).toEqual(secp256k1.publicKeyVerify(Uint8Array.from(XY)))
    expect(true).toEqual(secp256k1.privateKeyVerify(Uint8Array.from(D)))

    const context1 = new Context({
        public : XY,
        private: D,
    })
    const context2 = Context.fromJwk(context1.toJwk(/** includedPrivateKey = */ false))

    expect(true).toEqual(context1.validatePoint())
    expect(true).toEqual(context2.validatePoint())

    expect(Buffer.from([
        0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 
        0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 
        0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 
        0x0, 0x0,
    ])).toEqual(context2.getPrivateKey())

    const myObject: { test: string } = {
        test: 'ok',
    }

    const document = await CredentialSigner.sign<{ test: string }>(myObject, {
        did    : DID,
        context: context1,
    })
    const verified = await CredentialSigner.verify<{ test: string }>(document, {
        context: context2,
    })

    expect(true).toEqual(verified.isValid)
    expect({ test: 'ok' }).toEqual(verified.payload)
})

test('Signer - 5', async () => {
    const context = new Context({
        public : XY,
        private: D,
    })
 
    const credential = new UNiDVC<AddressCredentialV1>({
        '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://docs.unid.plus/docs/2020/credentials/address',
        ],
        id: DID,
        issuer: DID,
        issuanceDate: (new DateTimeUtils(new Date())).$toString(DateTimeTypes.default),
        type: [ 'VerifiableCredential', 'AddressOrganization' ],
        credentialSubject: {
            '@id': DID,
            '@type': 'AddressOrganization',
            address: {
                '@type': 'PostalAddress',
            }
        }
    })

    const signed = await credential.sign({
        did    : DID,
        context: context,
    })
    const verified = await UNiDVC.verify<AddressCredentialV1>(signed)

    expect(true).toEqual(verified.isValid)
    expect(credential.getVerifiableCredential()).toEqual(verified.payload)
})