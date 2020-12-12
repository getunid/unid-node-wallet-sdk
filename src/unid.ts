import { UNiDDidOperator } from '@unid/did-operator'
import { UNiDNotImplementedError } from "./error"

interface UNiDContext {
}

export class UNiD {
    private readonly context: UNiDContext
    private readonly operator: UNiDDidOperator

    constructor(context: UNiDContext) {
        this.context  = context
        this.operator = new UNiDDidOperator()
    }

    public async getDidDocument(params: { did: string }) {
        return await this.operator.resolve(params)
    }

    public async registerDid(did: string) {
        return await this.operator.create({
            publicKeys: [],
            commitmentKeys: {
                update  : {
                    kty: 'EC',
                    crv: 'secp256k1',
                    x  : '',
                    y  : '',
                },
                recovery: {
                    kty: 'EC',
                    crv: 'secp256k1',
                    x  : '',
                    y  : '',
                },
            },
            serviceEndpoints: [],
        })
    }

    public async updateDidDocument(did: string): Promise<void> {
        console.log(this.context)

        throw new UNiDNotImplementedError()
    }
}