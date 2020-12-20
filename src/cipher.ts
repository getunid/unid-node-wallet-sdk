import crypto from 'crypto'

export class Cipher {
    private static readonly ALGORITHM: string   = 'aes-256-cbc'
    private static readonly IV_LENGTH: number   = 16 // 128 Bit
    private static readonly SALT_LENGTH: number = 32 // 256 Bit
    private static readonly PASS_LENGTH: number = 32 // 256 Bit

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

        cipher.update(data)

        const final  = cipher.final()
        const buffer = Buffer.concat([ salt, iv, final ])

        return buffer
    }

    /**
     * @param buffer 
     * @param secret 
     */
    public static async decrypt(buffer: Buffer, secret: Buffer): Promise<Buffer> {
        if (buffer.length < (this.SALT_LENGTH + this.IV_LENGTH)) {
            throw new Error()
        }

        const salt  = buffer.slice(0, this.SALT_LENGTH)
        const iv    = buffer.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH)
        const final = buffer.slice(this.SALT_LENGTH + this.IV_LENGTH)
        const key   = await (new Promise<Buffer>((resolve, reject) => {
            crypto.scrypt(secret, salt, this.PASS_LENGTH, (err, key) => {
                if (err) {
                    return reject(err)
                }
                return resolve(key)
            })
        }))

        const cipher = crypto.createDecipheriv(this.ALGORITHM, key, iv)

        cipher.update(final)

        const data = cipher.final()

        return data
    }
}