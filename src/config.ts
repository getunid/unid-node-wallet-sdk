import dotenv from 'dotenv'

dotenv.config()

/**
 */
class ConfigManagerKlass {
    /**
     */
    public constructor() {}

    /**
     * @param key 
     * @param defaultValue 
     * @returns
     */
    private config(key: string, defaultValue: string): string {
        let e: string | undefined = process.env[key]

        if (! (e)) { e = defaultValue }

        return e
    }

    /**
     */
    public get SDS_ENDPOINT_BASE_URI(): string {
        return this.config('SDS_ENDPOINT_BASE_URI', 'https://sds.getunid.io')
    }

    /**
     */
    public get DID_ENDPOINT_BASE_URI(): string {
        return this.config('DID_ENDPOINT_BASE_URI', 'https://did.getunid.io')
    }
}

export const ConfigManager = new ConfigManagerKlass()