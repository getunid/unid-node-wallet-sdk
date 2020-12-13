import { UNiDContext, UNiDNetworkType } from './unid'

export class ConfigManager {
    private constructor() {}

    private static $context: UNiDContext | undefined

    public static setContext(context: UNiDContext): void {
        if (ConfigManager.$context === undefined) {
            ConfigManager.$context = context
        } else {
            throw new Error()
        }

        // Set default values
        if (ConfigManager.$context.envNetwork === undefined) {
            ConfigManager.$context.envNetwork = UNiDNetworkType.Testnet
        }
    }

    public static get context(): UNiDContext {
        if (! ConfigManager.$context) {
            throw new Error()
        }

        return ConfigManager.$context
    }
}