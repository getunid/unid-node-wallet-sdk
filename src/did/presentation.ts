import { UNiDVPSchema } from "."
import { CredentialSigner, ProofContext } from "../cipher/signer"
import { Secp256k1 } from "../keyring/secp256k1"
import { UNiD } from '../unid'

/**
 */
class VerifyContainer<T> {
    private $payload: UNiDVPSchema<object>
    private $isValid: boolean

    constructor(validated: { payload: any, isValid: boolean }) {
        this.$payload = validated.payload
        this.$isValid = validated.isValid
    }

    /**
     */
    public get isValid(): boolean {
        return this.$isValid
    }

    /**
     */
    public get payload(): UNiDVPSchema<object> {
        return this.$payload
    }

    /**
     */
    public get metadata(): any {
        return ''
        // const meta: UNiDVerifiableCredentialMetaExternal = {
        //     id    : this.$payload.id,
        //     issuer: this.$payload.issuer,
        //     issuanceDate  : (new DateTimeUtils(this.$payload.issuanceDate)).$toDate(),
        //     expirationDate: (new DateTimeUtils(this.$payload.expirationDate)).toDate(),
        // }

        // return meta
    }
}

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
    public static async verify<T>(presentation: UNiDVPSchema<T> & ProofContext): Promise<VerifyContainer<T>> {
        if (presentation.proof === undefined) {
            throw new Error()
        }

        const did = await UNiD.getDidDocument({
            did: presentation.proof.verificationMethod,
        })

        const validated = await CredentialSigner.verify(presentation, {
            context: Secp256k1.fromJwk(did.publicKeyJwk),
        })

        return new VerifyContainer(validated)
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