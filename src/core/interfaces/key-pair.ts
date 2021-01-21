export namespace KeyPair {
    export interface Secp256K1 {
        kty: 'EC'
        crv: 'secp256k1'
        x: string
        y: string
        d?: string
    }
}

export type PublicKeyType =
    | 'EcdsaSecp256k1VerificationKey2019'

export enum PublicKeyPurpose {
    Authentication = 'auth',
    General = 'general',
}