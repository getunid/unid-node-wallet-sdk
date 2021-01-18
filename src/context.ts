import { UNiDContext, UNiDNetworkType } from './unid'

class ContextManagerKlass {
    constructor() {}

    private $context: UNiDContext | undefined

    public setContext(context: UNiDContext): void {
        if (this.$context === undefined) {
            this.$context = context
        } else {
            throw new Error()
        }

        // Set default values
        if (this.$context.envNetwork === undefined) {
            this.$context.envNetwork = UNiDNetworkType.Testnet
        }
    }

    public get context(): UNiDContext {
        if (! this.$context) {
            throw new Error()
        }

        return this.$context
    }
}

export const ContextManager = new ContextManagerKlass()