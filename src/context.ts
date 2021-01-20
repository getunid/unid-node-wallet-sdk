import { UNiDContext, UNiDNetworkType } from './unid'

class ContextManagerKlass {
    constructor() {}

    private $context: UNiDContext | undefined

    public setContext(context: UNiDContext): void {
        // Validate contexts
        if (! this.isHex(context.encryptionKey)) {
            throw new Error()
        }
        if (context.encryptionKey.length !== 64) {
            throw new Error()
        }

        // Set default values
        if (context.envNetwork === undefined) {
            context.envNetwork = UNiDNetworkType.Testnet
        }

        // Set context
        if (this.$context === undefined) {
            this.$context = context
        } else {
            throw new Error()
        }
    }

    /**
     * @param input 
     * @returns
     */
    private isHex(input: string): boolean {
        const rule = new RegExp('^[0-9a-f]+$', 'i')

        return rule.test(input)
    }

    /**
     */
    public get context(): UNiDContext {
        if (! this.$context) {
            throw new Error()
        }

        return this.$context
    }
}

export const ContextManager = new ContextManagerKlass()