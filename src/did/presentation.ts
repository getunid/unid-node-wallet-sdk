import { UNiDExportedVerifiablePresentationMetadata, UNiDVerifiableCredential, UNiDVerifiablePresentation, UNiDVerifiablePresentationContext, UNiDVerifiablePresentationMetadata, UNiDWithoutProofVerifiablePresentationMetadata } from "../schemas"
import { DateTimeUtils } from "../utils/datetime"
import { CredentialSigner, ProofContext } from "../cipher/signer"
import { Secp256k1 } from "../keyring/secp256k1"
import { UNiD } from '../unid'

/**
 */
class VerifyContainer<T1> {
    private $object : UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>> & UNiDVerifiablePresentationMetadata
    private $payload: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>> & UNiDWithoutProofVerifiablePresentationMetadata
    private $isValid: boolean

    constructor(
        object: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>> & UNiDVerifiablePresentationMetadata,
        validated: { payload: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>> & UNiDWithoutProofVerifiablePresentationMetadata, isValid: boolean }
    ) {
        this.$object  = object
        this.$payload = validated.payload
        this.$isValid = validated.isValid
    }

    /**
     */
    public toJSON(): string {
        return JSON.stringify(this.$object)
    }

    /**
     */
    public get isValid(): boolean {
        return this.$isValid
    }

    /**
     */
    public get payload(): UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>> & UNiDWithoutProofVerifiablePresentationMetadata {
        return this.$payload
    }

    /**
     */
    public get metadata(): UNiDVerifiablePresentationContext & UNiDExportedVerifiablePresentationMetadata {
        const credentialTypes: Array<string> = this.$payload.verifiableCredential
            .map((vc) => {
                return vc.type
            })
            .reduce((left, right) => {
                right.forEach((type) => {
                    // [TODO]: 'VerifiableCredential' should be a constant
                    if (type !== 'VerifiableCredential') {
                        if (left.indexOf(type) < 0) {
                            left.push(type)
                        }
                    }
                })
                return left
            }, [])

        const issuanceDate   = (new DateTimeUtils(this.$payload.issuanceDate)).$toDate()
        const expirationDate = (new DateTimeUtils(this.$payload.expirationDate)).toDate()

        const meta: UNiDVerifiablePresentationContext & UNiDExportedVerifiablePresentationMetadata = {
            '@context': this.payload["@context"],
            type      : this.payload.type,
            id        : this.$payload.id,
            issuerDid : this.$payload.issuer,
            issuanceDate   : issuanceDate,
            expirationDate : expirationDate,
            credentialTypes: credentialTypes,
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
        return await CredentialSigner.sign(this.presentation, {
            did    : suite.did,
            context: suite.context,
        })
    }

    /**
     * @param presentation 
     */
    public static async verify<T1>(presentation: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, T1>> & UNiDVerifiablePresentationMetadata): Promise<VerifyContainer<T1>> {
        if (presentation.proof === undefined) {
            throw new Error()
        }

        const did = await UNiD.getDidDocument({
            did: presentation.proof.verificationMethod,
        })

        const validated = await CredentialSigner.verify(presentation, {
            context: Secp256k1.fromJwk(did.publicKeyJwk),
        })

        return new VerifyContainer(presentation, validated)
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