import crypto from 'crypto'

/**
 */
interface RequestDigest {
    uri    : string,
    payload: string,
}

/**
 */
export class Hasher {
    public static readonly ALGORITHM: string = 'sha512'

    private constructor() {}

    /**
     * @param data 
     * @param secret 
     */
    public static digest(data: Buffer, secret: Buffer): string {
        const hasher = crypto.createHmac(Hasher.ALGORITHM, secret)

        hasher.update(data)

        return hasher.digest('hex')
    }

    /**
     * @param input 
     * @param secret 
     */
    public static verify(data: Buffer, digest: Buffer, secret: Buffer): boolean {
        const hasher = crypto.createHmac(Hasher.ALGORITHM, secret)

        hasher.update(data)

        return hasher.digest().equals(digest)
    }

    public static verifyRequestDigest(uri: string, payload: string, digest: string, options: {
        clientSecret: string,
    }): boolean {
        const object: RequestDigest = {
            uri    : uri,
            payload: payload,
        }
        const json = JSON.stringify(object, Object.keys(object).sort())

        return Hasher.verify(
            Buffer.from(json  , 'utf-8'),
            Buffer.from(digest, 'hex'),
            Buffer.from(options.clientSecret, 'utf-8')
        )
    }

    /**
     * @param uri 
     * 
     * @param payload 
     */
    public static generateRequestDigest(uri: string, payload: string, options: {
        clientSecret: string,
    }): string {
        const object: RequestDigest = {
            uri    : uri,
            payload: payload,
        }
        const json = JSON.stringify(object, Object.keys(object).sort())

        return Hasher.digest(
            Buffer.from(json, 'utf-8'),
            Buffer.from(options.clientSecret, 'utf-8')
        )
    }
}