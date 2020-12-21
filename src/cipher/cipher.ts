import crypto from 'crypto'

/**
 */
export class Cipher {
    public static readonly ALGORITHM: string   = 'aes-256-cbc'
    public static readonly IV_LENGTH: number   = 16 // 128 Bit
    public static readonly SALT_LENGTH: number = 32 // 256 Bit
    public static readonly PASS_LENGTH: number = 32 // 256 Bit

    private constructor() {}

    /**
     * @param data 
     * @param secret 
     */
    public static async encrypt(data: Buffer, secret: Buffer): Promise<Buffer> {
        const salt = crypto.randomBytes(this.SALT_LENGTH)
        const iv   = crypto.randomBytes(this.IV_LENGTH)
        const key  = await (new Promise<Buffer>((resolve, reject) => {
            crypto.scrypt(secret, salt, this.PASS_LENGTH, (err, key) => {
                if (err) {
                    return reject(err)
                }
                return resolve(key)
            })
        }))

        const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv)
        const buffer = cipher.update(data)

        return Buffer.concat([
            salt, iv, Buffer.concat([ buffer, cipher.final() ])
        ])
    }

    /**
     * @param buffer 
     * @param secret 
     */
    public static async decrypt(data: Buffer, secret: Buffer): Promise<Buffer> {
        if (data.length < (this.SALT_LENGTH + this.IV_LENGTH)) {
            throw new Error()
        }

        const salt  = data.slice(0, this.SALT_LENGTH)
        const iv    = data.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH)
        const final = data.slice(this.SALT_LENGTH + this.IV_LENGTH)
        const key   = await (new Promise<Buffer>((resolve, reject) => {
            crypto.scrypt(secret, salt, this.PASS_LENGTH, (err, key) => {
                if (err) {
                    return reject(err)
                }
                return resolve(key)
            })
        }))

        const cipher = crypto.createDecipheriv(this.ALGORITHM, key, iv)
        const buffer = cipher.update(final)

        return Buffer.concat([
            buffer, cipher.final()
        ])
    }
}