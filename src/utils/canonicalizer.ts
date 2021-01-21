import canonicalize from 'canonicalize'

export default class JsonCanonicalizer {
    public static canonicalizeAsBuffer (content: object): Buffer {
        const canonicalizedString: string = (canonicalize(content) || '')

        return Buffer.from(canonicalizedString)
    }
}