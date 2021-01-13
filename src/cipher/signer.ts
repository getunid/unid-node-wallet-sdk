import { Secp256k1 as Context } from "../keyring/secp256k1";
import crypto from 'crypto'
import secp256k1 from 'secp256k1'
import base64url from 'base64url'
import lodash from 'lodash'
import { DateTimeTypes, DateTimeUtils } from "../utils/datetime";

interface JwsHeader {
    alg: 'ES256K',
    b64: boolean,
    crit: Array<'b64'>
}

export interface ProofContext {
    proof?: {
        type: 'EcdsaSecp256k1Signature2019' | string,
        proofPurpose: 'authentication' | string,
        created: string,
        verificationMethod: string,
        jws: string
        controller?: string,
        challenge?: string,
        domain?: string,
    }
}

export class CredentialSigner {
    private static readonly PROOF_KEY: string = 'proof'

    private constructor() {}

    public static async sign<T>(object: T, suite: {
        did    : string,
        context: Context,
    }): Promise<T & ProofContext> {
        if (Object.keys(object).indexOf(this.PROOF_KEY) !== -1) {
            throw new Error()
        }

        const created = (new DateTimeUtils(new Date())).$toString(DateTimeTypes.default)
        const jws = await Jws.encode(object, suite.context)
        const proof: ProofContext = {
            proof: {
                type: 'EcdsaSecp256k1Signature2019',
                proofPurpose: 'authentication',
                created: created,
                verificationMethod: suite.did,
                jws: jws,
            }
        }

        // Sign
        const signedObject = lodash.merge(proof, object)

        return signedObject
    }

    public static async verify<T>(object: T & ProofContext, suite: {
        context: Context,
    }): Promise<{ payload: T, isValid: boolean }> {
        if (Object.keys(object).indexOf(this.PROOF_KEY) === -1) {
            throw new Error()
        }

        const proof = object.proof

        if (proof === undefined) {
            throw new Error()
        }

        const jws     = proof.jws
        const payload = lodash.omit(object, [ this.PROOF_KEY ]) as T

        // Verify
        const isValid = await Jws.verify(payload, jws, suite.context)

        return {
            payload: payload,
            isValid: isValid,
        }
    }
}

/**
 */
export class Jws {
    private constructor() {}

    /**
     * @param object 
     * @param context 
     */
    public static async encode(object: any, context: Context): Promise<string> {
        // Header
        const header: JwsHeader = {
            alg : 'ES256K',
            b64 : false,
            crit: [ 'b64' ]
        }
        const $header = base64url.encode(
            Buffer.from(JSON.stringify(header), 'utf-8')
        )

        // Payload
        const $payload = base64url.encode(
            Buffer.from(JSON.stringify(object), 'utf-8')
        )

        // Message
        const message = [ $header, $payload ].join('.')

        // Signature
        const signature  = await Signer.sign(Buffer.from(message, 'utf-8'), context)
        const $signature = base64url.encode(signature)

        return [ $header, '', $signature ].join('.')
    }

    /**
     * @param object 
     * @param jws 
     * @param key 
     */
    public static async verify(object: any, jws: string, context: Context): Promise<boolean> {
        const [ $header, $_payload, $signature ] = jws.split('.')

        if (($header == undefined) || ($_payload == undefined) || ($signature == undefined)) {
            throw new Error()
        }

        // Header
        const header: JwsHeader = JSON.parse(base64url.decode($header))

        if (header.alg !== 'ES256K') {
            throw new Error()
        }
        if (header.b64 !== false) {
            throw new Error()
        }
        if (header.crit.indexOf('b64') === -1) {
            throw new Error()
        }

        // Payload
        if ($_payload !== '') {
            throw new Error()
        }

        const $payload = base64url.encode(
            Buffer.from(JSON.stringify(object), 'utf-8')
        )

        // Message
        const message = [ $header, $payload ].join('.')

        // Signature
        const signature = Buffer.from(base64url.toBuffer($signature))

        // Verify
        return await Signer.verify(Buffer.from(message), signature, context)
    }
}

/**
 */
export class Signer {
    /** */
    public  static readonly ALGORITHM: string = 'sha256'

    private constructor() {}

    /**
     * @param message 
     * @param context 
     */
    public static async sign(message: Buffer, context: Context): Promise<Buffer> {
        const hasher  = crypto.createHash(this.ALGORITHM)
        const payload = JSON.stringify(message)

        hasher.update(payload)

        const digest    = hasher.digest()
        const signature = secp256k1.ecdsaSign(
            Uint8Array.from(digest),
            Uint8Array.from(context.getPrivateKey()),
        )

        return Buffer.from(signature.signature)
    }

    /**
     * @param message 
     * @param signature 
     * @param context 
     */
    public static async verify(message: object, signature: Buffer, context: Context): Promise<boolean> {
        const hasher  = crypto.createHash(this.ALGORITHM)
        const payload = JSON.stringify(message)

        hasher.update(payload)

        const digest = hasher.digest()
        const verify = secp256k1.ecdsaVerify(
            Uint8Array.from(signature),
            Uint8Array.from(digest),
            Uint8Array.from(context.getPublicKey())
        )

        return verify
    }
}