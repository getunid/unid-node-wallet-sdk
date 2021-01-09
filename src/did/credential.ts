import { UNiDVerifiableCredentialMeta } from "../schemas"
import { CredentialSigner, ProofContext } from "../cipher/signer"
import { Secp256k1 } from "../keyring/secp256k1"
import { UNiD } from '../unid'

/**
 */
export class UNiDVerifiableCredential<T> {
    private $credential: T

    /**
     * @param credential 
     */
    constructor(credential: T) {
        this.$credential = credential
    }

    /**
     */
    public get credential(): T {
        return this.$credential
    }

    /**
     */
    public get metadata(): UNiDVerifiableCredentialMeta {
        // TODO: Not able to exclude
        const cred: any = this.$credential
        const metadata  = cred as UNiDVerifiableCredentialMeta

        return metadata
    }

    /**
     * @param suite 
     */
    public async sign(suite: { did: string, context: Secp256k1 }): Promise<T> {
        return await CredentialSigner.sign<T>(this.$credential, {
            did    : suite.did,
            context: suite.context,
        })
    }

    /**
     * @param credential 
     */
    public static async verify<T>(credential: T & ProofContext): Promise<{ payload: T, isValid: boolean }> {
        if (credential.proof === undefined) {
            throw new Error()
        }

        const did = await UNiD.getDidDocument({
            did: credential.proof.verificationMethod,
        })

        return await CredentialSigner.verify<T>(credential, {
            context: Secp256k1.fromJwk(did.publicKeyJwk),
        })
    }
}