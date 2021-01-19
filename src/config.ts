import dotenv from 'dotenv'

dotenv.config()

class ConfigManagerKlass {
    public constructor() {}

    /**
     * @param key 
     * @param defaultValue 
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
    get ENCRYPTION_KEY(): string {
        return this.config('ENCRYPTION_KEY', '1affd4c6096d0ef4344e963612229dbf786bbc23c60611093fa9149c0e815e68')
    }

    /**
     */
    get ENCRYPTION_ALGORITHM(): string {
        return this.config('ENCRYPTION_ALGORITHM', 'aes-256-cbc')
    }

    /**
     */
    get ENCRYPTION_IV_LENGTH(): number {
        return (+(this.config('ENCRYPTION_IV_LENGTH', '16')))
    }
}

export const ConfigManager = new ConfigManagerKlass()