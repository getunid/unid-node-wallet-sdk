import crypto from 'crypto'
import { Signer, Jws, JsonLdSigner } from '../src/cipher/signer'
import { Secp256k1 as Context } from '../src/keyring/secp256k1'
import secp256k1 from 'secp256k1'

test('Signer - 1', async () => {
    const priv = Buffer.from(crypto.randomBytes(32))
    const pub  = Buffer.from(secp256k1.publicKeyCreate(Uint8Array.from(priv), true))

    expect(true).toEqual(secp256k1.privateKeyVerify(Uint8Array.from(priv)))
    expect(true).toEqual(secp256k1.publicKeyVerify(Uint8Array.from(pub)))

    const context = new Context({
        public : pub,
        private: priv,
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
    const priv = Buffer.from(crypto.randomBytes(32))
    const pub  = Buffer.from(secp256k1.publicKeyCreate(Uint8Array.from(priv), true))

    expect(true).toEqual(secp256k1.privateKeyVerify(Uint8Array.from(priv)))
    expect(true).toEqual(secp256k1.publicKeyVerify(Uint8Array.from(pub)))

    const context = new Context({
        public : pub,
        private: priv,
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
    const priv = Buffer.from(crypto.randomBytes(32))
    const pub  = Buffer.from(secp256k1.publicKeyCreate(Uint8Array.from(priv), true))

    expect(true).toEqual(secp256k1.privateKeyVerify(Uint8Array.from(priv)))
    expect(true).toEqual(secp256k1.publicKeyVerify(Uint8Array.from(pub)))

    const context = new Context({
        public : pub,
        private: priv,
    })

    expect(true).toEqual(context.validatePoint())

    const myObject: { test: string } = {
        test: 'ok',
    }

    const document = await JsonLdSigner.sign<{ test: string }>(myObject, context)
    const verified = await JsonLdSigner.verify<{ test: string }>(document, context)

    expect(true).toEqual(verified.isValid)
    expect({ test: 'ok' }).toEqual(verified.payload)
})

test('Signer - 4', async () => {
    const priv = Buffer.from(crypto.randomBytes(32))
    const pub  = Buffer.from(secp256k1.publicKeyCreate(Uint8Array.from(priv), true))

    expect(true).toEqual(secp256k1.privateKeyVerify(Uint8Array.from(priv)))
    expect(true).toEqual(secp256k1.publicKeyVerify(Uint8Array.from(pub)))

    const context1 = new Context({
        public : pub,
        private: priv,
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

    const document = await JsonLdSigner.sign<{ test: string }>(myObject, context1)
    const verified = await JsonLdSigner.verify<{ test: string }>(document, context2)

    expect(true).toEqual(verified.isValid)
    expect({ test: 'ok' }).toEqual(verified.payload)
})

