import { KeyPair, DidPublicKey } from '@unid/did-operator'
import base64url from 'base64url'
import secp256k1 from 'secp256k1'

interface Secp256k1Context {
    public : Buffer,
    private: Buffer,
}

const PRIVATE_KEY_SIZE            : number = 32 // Buffer(PrivateKey (32 = 256 bit))
const COMPRESSED_PUBLIC_KEY_SIZE  : number = 33 // Buffer(0x04 + PublicKey (32 = 256 bit))
const UNCOMPRESSED_PUBLIC_KEY_SIZE: number = 65 // Buffer(0x04 + PublicKey (64 = 512 bit))

export class Secp256k1 {
    private _public : Buffer
    private _private: Buffer

    /**
     * @param context 
     */
    constructor(context: Secp256k1Context) {
        if (context.private.length !== PRIVATE_KEY_SIZE) {
            throw new Error()
        }
        this._private = context.private

        if (context.public.length !== COMPRESSED_PUBLIC_KEY_SIZE) {
            throw new Error()
        }
        this._public = this.transformUncompressedPublicKey(context.public)
    }

    /**
     */
    public get publicKey(): Buffer {
        return this._public
    }

    /**
     */
    public get privateKey(): Buffer {
        return this._private
    }

    /**
     */
    public toKeyPair(): KeyPair.Secp256K1 {
        if (! this.validatePoint(this.pointX, this.pointY)) {
            throw new Error()
        }

        return {
            kty: 'EC',
            crv: 'secp256k1',
            x  : base64url.encode(this.pointX),
            y  : base64url.encode(this.pointY),
            d  : base64url.encode(this.privateKey),
        }
    }

    /**
     */
    public toJwk(): KeyPair.Secp256K1 {
        if (! this.validatePoint(this.pointX, this.pointY)) {
            throw new Error()
        }

        return {
            kty: 'EC',
            crv: 'secp256k1',
            x  : base64url.encode(this.pointX),
            y  : base64url.encode(this.pointY),
        }
    }

    /**
     */
    public toPublicKey(id: string, purpose: Array<string>): DidPublicKey {
        if (! this.validatePoint(this.pointX, this.pointY)) {
            throw new Error()
        }

        return {
            id  : id,
            type: 'EcdsaSecp256k1VerificationKey2019',
            jwk : this.toJwk(),
            purpose: purpose,
        }
    }

    /**
     */
    private get pointX(): Buffer {
        if (this.publicKey.length !== UNCOMPRESSED_PUBLIC_KEY_SIZE) {
            throw new Error()
        }
        if (this.publicKey[0] !== 0x04) {
            throw new Error()
        }
        const n = this.publicKey.slice(1)
        const s = n.slice(0, 32)

        return s
    }
    
    /**
     */
    private get pointY(): Buffer {
        if (this.publicKey.length !== UNCOMPRESSED_PUBLIC_KEY_SIZE) {
            throw new Error()
        }
        if (this.publicKey[0] !== 0x04) {
            throw new Error()
        }
        const n = this.publicKey.slice(1)
        const s = n.slice(32)

        return s
    }
    
    /**
     * @param x 
     * @param y 
     */
    public validatePoint(x: Buffer, y: Buffer): boolean {
        const nx = parseInt(x.toString('hex'), 16)
        const ny = parseInt(y.toString('hex'), 16)
        const np = parseInt('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 16)
    
        return ((ny * ny - nx * nx * nx - 7) % np === 0)
    }

    /**
     * @param compressed 
     */
    private transformUncompressedPublicKey(compressed: Buffer): Buffer {
        return Buffer.from(secp256k1.publicKeyConvert(compressed, false))
    }
}