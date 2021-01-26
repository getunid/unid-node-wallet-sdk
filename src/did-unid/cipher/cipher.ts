import { Runtime } from '../../runtime'

/**
 */
export class Cipher {
    /**
     */
    public static readonly ALGORITHM: string   = 'aes-256-cbc'

    /**
     */
    public static readonly IV_LENGTH: number   = 16 // 128 Bit

    /**
     */
    public static readonly SALT_LENGTH: number = 32 // 256 Bit

    /**
     */
    public static readonly PASS_LENGTH: number = 32 // 256 Bit

    /**
     */
    private constructor() {}

    /**
     * @param data 
     * @param secret 
     * @returns
     */
    public static async encrypt(data: Buffer, secret: Buffer): Promise<Buffer> {
        const salt = Runtime.Commons.randomBytes(this.SALT_LENGTH)
        const iv   = Runtime.Commons.randomBytes(this.IV_LENGTH)
        const key  = await Runtime.Scrypt.kdf(secret, salt, this.PASS_LENGTH)

        return Buffer.concat([ salt, iv, Runtime.AES.encrypt(data, key, iv) ])
    }

    /**
     * @param data 
     * @param secret 
     * @returns
     */
    public static async decrypt(data: Buffer, secret: Buffer): Promise<Buffer> {
        if (data.length < (this.SALT_LENGTH + this.IV_LENGTH)) {
            throw new Error()
        }

        const salt  = data.slice(0, this.SALT_LENGTH)
        const iv    = data.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH)
        const final = data.slice(this.SALT_LENGTH + this.IV_LENGTH)
        const key   = await Runtime.Scrypt.kdf(secret, salt, this.PASS_LENGTH)

        return Runtime.AES.decrypt(final, key, iv)
    }
}