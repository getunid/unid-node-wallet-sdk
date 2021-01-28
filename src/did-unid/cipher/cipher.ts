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
    public static async encrypt(content: Buffer, secret: Buffer): Promise<Buffer> {
        const salt = await Runtime.Commons.randomBytes(this.SALT_LENGTH)
        const iv   = await Runtime.Commons.randomBytes(this.IV_LENGTH)
        const key  = await Runtime.Scrypt.kdf(secret, salt, this.PASS_LENGTH)

        return Buffer.concat([ salt, Runtime.AES.encrypt(content, key, iv), iv ])
    }

    /**
     * @param data 
     * @param secret 
     * @returns
     */
    public static async decrypt(content: Buffer, secret: Buffer): Promise<Buffer> {
        if (content.length < (this.SALT_LENGTH + this.IV_LENGTH)) {
            throw new Error()
        }

        const salt = content.slice(0, this.SALT_LENGTH)
        const iv   = content.slice(-(this.IV_LENGTH))
        const data = content.slice(this.SALT_LENGTH, -(this.IV_LENGTH))
        const key  = await Runtime.Scrypt.kdf(secret, salt, this.PASS_LENGTH)

        return Runtime.AES.decrypt(data, key, iv)
    }
}