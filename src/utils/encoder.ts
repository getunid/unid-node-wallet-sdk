import base64url from 'base64url'

export class Encoder {
    public static encode (content: Buffer | string): string {
        return base64url.encode(content)
    }

    public static decodeAsBuffer (encodedContent: string): Buffer {
        Encoder.validateBase64UrlString(encodedContent)

        return base64url.toBuffer(encodedContent)
    }

    public static decodeAsString (encodedContent: string): string {
        return Encoder.decodeBase64UrlAsString(encodedContent)
    }

    public static decodeBase64UrlAsString (input: string): string {
        Encoder.validateBase64UrlString(input)

        return base64url.decode(input)
    }

    private static validateBase64UrlString (input: any) {
        if (typeof input !== 'string') {
            throw new Error()
        }

        const isBase64UrlString = Encoder.isBase64UrlString(input)

        if (! isBase64UrlString) {
            throw new Error()
        }
    }

    public static isBase64UrlString (input: string): boolean {
        return (new RegExp('^[A-Za-z0-9_-]+$')).test(input)
    }
}