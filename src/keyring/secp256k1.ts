import { KeyPair, DidPublicKey } from '@unid/did-operator'
import base64url from 'base64url'
import secp256k1 from 'secp256k1'
import { utils } from '../utils/utils'

interface Secp256k1Context {
    public : Buffer,
    private: Buffer,
}

export interface Secp256k1HexKeyPair {
    public : string,
    private: string,
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

        switch (context.public.length) {
            case COMPRESSED_PUBLIC_KEY_SIZE: {
                this._public = this.transformUncompressedPublicKey(context.public)
                break
            }
            case UNCOMPRESSED_PUBLIC_KEY_SIZE: {
                this._public = context.public
                break
            }
            default: {
                throw new Error()
            }
        }
    }

    /**
     */
    public getPublicKey(): Buffer {
        return this._public
    }

    /**
     */
    public getPrivateKey(): Buffer {
        return this._private
    }

    /**
     */
    public toHexKeyPair(): Secp256k1HexKeyPair {
        return {
            public : this.getPublicKey().toString('hex'),
            private: this.getPrivateKey().toString('hex'),
        }
    }

    public static fromJwk(jwk: KeyPair.Secp256K1): Secp256k1 {
        let d = jwk.d
        let x = jwk.x
        let y = jwk.y

        if (d === undefined) {
            d = base64url.encode(
                Buffer.from(utils.range(0, PRIVATE_KEY_SIZE).map(() => {
                    return 0x0
                }))
            )
        }

        return new Secp256k1({
            private: Buffer.from(base64url.toBuffer(d)),
            public : Buffer.from(
                Buffer.concat([
                    Uint8Array.from([ 0x04 ]),
                    Uint8Array.from(base64url.toBuffer(x)),
                    Uint8Array.from(base64url.toBuffer(y)),
                ])
            ),
        })
    }

    /**
     */
    public toJwk(includedPrivateKey: boolean = false): KeyPair.Secp256K1 {
        if (! this.validatePoint()) {
            throw new Error()
        }

        const jwk: KeyPair.Secp256K1 = {
            kty: 'EC',
            crv: 'secp256k1',
            x  : base64url.encode(this.getPointX()),
            y  : base64url.encode(this.getPointY()),
        }

        if (includedPrivateKey) {
            jwk.d = base64url.encode(this.getPrivateKey())
        }

        return jwk
    }

    /**
     */
    public toPublicKey(id: string, purpose: Array<string>): DidPublicKey {
        if (! this.validatePoint()) {
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
    public getPointX(): Buffer {
        if (this.getPublicKey().length !== UNCOMPRESSED_PUBLIC_KEY_SIZE) {
            throw new Error()
        }
        if (this.getPublicKey()[0] !== 0x04) {
            throw new Error()
        }
        const n = this.getPublicKey().slice(1)
        const s = n.slice(0, 32)

        return s
    }
    
    /**
     */
    public getPointY(): Buffer {
        if (this.getPublicKey().length !== UNCOMPRESSED_PUBLIC_KEY_SIZE) {
            throw new Error()
        }
        if (this.getPublicKey()[0] !== 0x04) {
            throw new Error()
        }
        const n = this.getPublicKey().slice(1)
        const s = n.slice(32)

        return s
    }
    
    /**
     */
    public validatePoint(): boolean {
        const nx = parseInt(this.getPointX().toString('hex'), 16)
        const ny = parseInt(this.getPointY().toString('hex'), 16)
        const np = parseInt('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 16)
    
        return ((ny * ny - nx * nx * nx - 7) % np === 0)
    }

    /**
     * @param compressed 
     */
    private transformUncompressedPublicKey(compressed: Buffer): Buffer {
        return Buffer.from(secp256k1.publicKeyConvert(Uint8Array.from(compressed), false))
    }
}