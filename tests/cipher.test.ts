import crypto from 'crypto'
import { Cipher } from '../src/cipher'

test('Cipher#enc/dec - 1', async () => {
    const data: Buffer   = Buffer.from('hello', 'utf-8')
    const secret: Buffer = Buffer.from('secret', 'utf-8')

    const enc = await Cipher.encrypt(data, secret)
    const dec = await Cipher.decrypt(enc, secret)

    expect(data).toEqual(dec)
})

test('Cipher#enc/dec - 2', async () => {
    const data: Buffer    = Buffer.from('hello', 'utf-8')
    const secret1: Buffer = Buffer.from('secret1', 'utf-8')
    const secret2: Buffer = Buffer.from('secret2', 'utf-8')

    await expect(async () => {
        const enc = await Cipher.encrypt(data, secret1)
        await Cipher.decrypt(enc, secret2)
    }).rejects.toThrow()
})

test('Cipher#dec - 1', async () => {
    const data = crypto.randomBytes((16 + 32) - 1)
    const secret: Buffer = Buffer.from('secret', 'utf-8')

    await expect(async () => {
        await Cipher.decrypt(data, secret)
    }).rejects.toThrow()
})