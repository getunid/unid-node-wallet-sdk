import { UNiDExportedVerifiablePresentationMetadata, UNiDVerifiablePresentation, UNiDVerifiablePresentationMetadata } from "src/schemas"
import { DateTimeUtils } from "src/utils/datetime"
import { CredentialSigner, ProofContext } from "../cipher/signer"
import { Secp256k1 } from "../keyring/secp256k1"
import { UNiD } from '../unid'

/**
 */
class VerifyContainer<T1> {
    private $payload: UNiDVerifiablePresentation<T1> & UNiDVerifiablePresentationMetadata
    private $isValid: boolean

    constructor(validated: { payload: UNiDVerifiablePresentation<T1> & UNiDVerifiablePresentationMetadata, isValid: boolean }) {
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
    public get payload(): UNiDVerifiablePresentation<T1> & UNiDVerifiablePresentationMetadata {
        return this.$payload
    }

    /**
     */
    public get metadata(): UNiDExportedVerifiablePresentationMetadata {
        const meta: UNiDExportedVerifiablePresentationMetadata = {
            '@context': this.payload["@context"],
            type      : this.payload.type,
            id        : this.$payload.id,
            issuer    : this.$payload.issuer,
            issuanceDate  : (new DateTimeUtils(this.$payload.issuanceDate)).$toDate(),
            expirationDate: (new DateTimeUtils(this.$payload.expirationDate)).toDate(),
        }

        return meta
    }
}

/**
 */
export class VerifiablePresentation<T1> {
    private presentation: T1

    /**
     * @param presentation 
     */
    constructor(presentation: T1) {
        this.presentation = presentation
    }

    /**
     */
    public getVerifiablePresentation(): T1 {
        return this.presentation
    }

    /**
     * @param suite 
     */
    public async sign(suite: { did: string, context: Secp256k1 }): Promise<T1 & ProofContext> {
        return await CredentialSigner.sign<T1>(this.presentation, {
            did    : suite.did,
            context: suite.context,
        })
    }

    /**
     * @param presentation 
     */
    public static async verify<T1>(presentation: UNiDVerifiablePresentation<T1> & UNiDVerifiablePresentationMetadata): Promise<VerifyContainer<T1>> {
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
    public static filter<T1>(vcs: Array<any>, checker: (input: any) => boolean): Array<T1> {
        return vcs.filter((vc) => {
            return checker(vc)
        }) as Array<T1>
    }
}