import { UNiDVPSchema } from "."
import { CredentialSigner, ProofContext } from "../cipher/signer"
import { Secp256k1 } from "../keyring/secp256k1"
import { UNiD } from '../unid'

/**
 */
export class UNiDVerifiablePresentation<T> {
    private presentation: T

    /**
     * @param presentation 
     */
    constructor(presentation: T) {
        this.presentation = presentation
    }

    /**
     */
    public getVerifiablePresentation(): T {
        return this.presentation
    }

    /**
     * @param suite 
     */
    public async sign(suite: { did: string, context: Secp256k1 }): Promise<T & ProofContext> {
        return await CredentialSigner.sign<T>(this.presentation, {
            did    : suite.did,
            context: suite.context,
        })
    }

    /**
     * @param presentation 
     */
    public static async verify<T>(presentation: UNiDVPSchema<T> & ProofContext): Promise<{ payload: UNiDVPSchema<T>, isValid: boolean }> {
        if (presentation.proof === undefined) {
            throw new Error()
        }

        const did = await UNiD.getDidDocument({
            did: presentation.proof.verificationMethod,
        })

        const result = await CredentialSigner.verify<UNiDVPSchema<T>>(presentation, {
            context: Secp256k1.fromJwk(did.publicKeyJwk),
        })

        const payload: UNiDVPSchema<T> = result.payload

        return {
            payload: payload,
            isValid: result.isValid,
        }
    }

    /**
     * @param vcs 
     * @param checker 
     */
    public static filter<T>(vcs: Array<any>, checker: (input: any) => boolean): Array<T> {
        return vcs.filter((vc) => {
            return checker(vc)
        }) as Array<T>
    }
}