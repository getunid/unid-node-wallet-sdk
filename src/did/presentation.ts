import { CredentialSigner, ProofContext } from "../cipher/signer"
import { Secp256k1 } from "../keyring/secp256k1"
import { UNiD } from '../unid'

/**
 */
export class UNiDVerifiablePresentation {
    private presentation: Object

    /**
     * @param presentation 
     */
    constructor(presentation: Object) {
        this.presentation = presentation
    }

    /**
     */
    public getVerifiablePresentation(): Object {
        return this.presentation
    }

    /**
     * @param suite 
     */
    public async sign(suite: { did: string, context: Secp256k1 }): Promise<Object & ProofContext> {
        return await CredentialSigner.sign<Object>(this.presentation, {
            did    : suite.did,
            context: suite.context,
        })
    }

    /**
     * @param credential 
     */
    public static async verify(presentation: Object & ProofContext): Promise<{ isValid: boolean }> {
        if (presentation.proof === undefined) {
            throw new Error()
        }

        const did = await UNiD.getDidDocument({
            did: presentation.proof.verificationMethod,
        })

        return await CredentialSigner.verify<Object>(presentation, {
            context: Secp256k1.fromJwk(did.publicKeyJwk),
        })
    }
}