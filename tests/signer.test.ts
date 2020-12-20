import crypto from 'crypto'
import { Signer, Jws, JsonLdSigner } from '../src/signer'
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

    const proof    = await JsonLdSigner.sign<{ test: string }>(myObject, context)
    const verified = await JsonLdSigner.verify<{ test: string }>(proof, context)

    expect(true).toEqual(verified.isValid)
    expect({ test: 'ok' }).toEqual(verified.payload)
})
