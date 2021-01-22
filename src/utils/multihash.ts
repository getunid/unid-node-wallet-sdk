import multihashes from 'multihashes'
import CryptoJS from 'crypto-js'
import { Encoder } from './encoder'
import JsonCanonicalizer from './canonicalizer'

/**
 */
const ALGORITHM_CODE = 0x12 // sha256

/**
 */
export class Multihash {
    /**
     * @param content 
     * @returns
     */
    public static hash (content: Buffer): Buffer {
        const conventionalHash = this.hashAsNonMultihashBuffer(content)

        return Buffer.from(multihashes.encode(Uint8Array.from(conventionalHash), ALGORITHM_CODE))
    }

    /**
     * @param content 
     * @returns
     */
    public static hashAsNonMultihashBuffer (content: Buffer): Buffer {
        const buffer = CryptoJS.enc.Hex.parse(content.toString('hex'))
        const cipher = CryptoJS.SHA256(buffer)

        return Buffer.from(cipher.toString(CryptoJS.enc.Hex), 'hex')
    }

    /**
     * @param content 
     * @returns
     */
    public static canonicalizeThenDoubleHashThenEncode (content: object) {
        const contentBuffer = JsonCanonicalizer.canonicalizeAsBuffer(content);

        const intermediateHashBuffer = Multihash.hashAsNonMultihashBuffer(contentBuffer)

        return Multihash.hashThenEncode(intermediateHashBuffer)
    }

    /**
     * @param content 
     * @returns
     */
    public static hashThenEncode (content: Buffer): string {
        const multihashBuffer = Multihash.hash(content)

        return Encoder.encode(multihashBuffer)
    }

    /**
     * @param multihashBuffer 
     * @returns
     */
    public static decode (multihashBuffer: Buffer): { algorithm: number, hash: Buffer } {
        const multihash = multihashes.decode(Uint8Array.from(multihashBuffer))

        return {
            hash: Buffer.from(multihash.digest),
            algorithm: multihash.code,
        }
    }

    /**
     * @param hash 
     */
    public static verifyHashComputedUsingLatestSupportedAlgorithm (hash: Buffer) {
        const isLatestSupportedHashFormat = Multihash.isComputedUsingHashAlgorithm(hash, ALGORITHM_CODE)

        if (! isLatestSupportedHashFormat) {
            throw new Error()
        }
    }

    /**
     * @param encodedHash 
     */
    public static verifyEncodedHashIsComputedUsingLastestAlgorithm (encodedHash: string) {
        const hashBuffer = Encoder.decodeAsBuffer(encodedHash)

        Multihash.verifyHashComputedUsingLatestSupportedAlgorithm(hashBuffer)
    }

    /**
     * @param hash 
     * @param expectedHashAlgorithmInMultihashCode 
     * @returns
     */
    public static isComputedUsingHashAlgorithm (hash: Buffer, expectedHashAlgorithmInMultihashCode: number): boolean {
        try {
            const multihash = multihashes.decode(Uint8Array.from(hash))

            return (multihash.code === expectedHashAlgorithmInMultihashCode)
        } catch {
            return false
        }
    }

    /**
     * @param encodedContent 
     * @param encodedMultihash 
     * @returns
     */
    public static isValidHash (encodedContent: string | undefined, encodedMultihash: string): boolean {
        if (encodedContent === undefined) {
            return false
        }

        try {
            const contentBuffer = Encoder.decodeAsBuffer(encodedContent)

            return Multihash.verify(contentBuffer, encodedMultihash)
        } catch (error) {
            return false
        }
    }

    /**
     * @param content 
     * @param encodedMultihash 
     * @returns
     */
    public static canonicalizeAndVerifyDoubleHash (content: object | undefined, encodedMultihash: string): boolean {
        if (content === undefined) {
            return false
        }

        try {
            const contentBuffer = JsonCanonicalizer.canonicalizeAsBuffer(content)

            return Multihash.verifyDoubleHash(contentBuffer, encodedMultihash)
        } catch (error) {
            return false
        }
    }

    /**
     * @param content 
     * @param encodedMultihash 
     * @returns
     */
    private static verifyDoubleHash (content: Buffer, encodedMultihash: string): boolean {
        try {
            const expectedMultihashBuffer = Encoder.decodeAsBuffer(encodedMultihash)
            const intermediateHashBuffer = Multihash.hashAsNonMultihashBuffer(content)
            const actualMultihashBuffer = Multihash.hash(intermediateHashBuffer)

            return Buffer.compare(actualMultihashBuffer, expectedMultihashBuffer) === 0
        } catch (error) {
            return false
        }
    }

    /**
     * @param content 
     * @param encodedMultihash 
     * @returns
     */
    private static verify (content: Buffer, encodedMultihash: string): boolean {
        try {
            const expectedMultihashBuffer = Encoder.decodeAsBuffer(encodedMultihash)
            const actualMultihashBuffer = Multihash.hash(content)

            return Buffer.compare(actualMultihashBuffer, expectedMultihashBuffer) === 0
        } catch (error) {
            return false
        }
    }
}