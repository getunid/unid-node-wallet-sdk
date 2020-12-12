import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import secp256k1 from 'secp256k1'

interface BIP39Context {
    mnemonic: string,
    seed: Buffer,
}

enum PublicKeyType {
    SECP256K1,
}

export class UNiDWallet {
    public static generateBip39Seed = async (): Promise<BIP39Context> => {
        const mnemonic = bip39.generateMnemonic()
        const seed = await bip39.mnemonicToSeed(mnemonic)
    
        return {
            mnemonic: mnemonic,
            seed: seed,
        }
    }
    
    public static generateHDNodeByDerivationPath = async (context: BIP39Context, derivationPath: string): Promise<bip32.BIP32Interface> => {
        const root = bip32.fromSeed(context.seed)
        const child = root.derivePath(derivationPath)
    
        return child
    }
    
    public static transformPublicKey = async (node: bip32.BIP32Interface, as: PublicKeyType): Promise<Buffer> => {
        switch (as) {
            case PublicKeyType.SECP256K1: {
                const k1 = Buffer.from(node.publicKey)
                const k2 = Buffer.from(secp256k1.publicKeyConvert(k1, false))
    
                return k2
            }
            default: {
                throw new Error('Does not support your specified key type')
            }
        }
    }
    
    public getPointX = (k: Buffer): Buffer => {
        if (k[0] !== 0x04) {
            throw new Error('Unsupported public key format')
        }
        const n = k.slice(1)
    
        return n.slice(0, 32)
    }
    
    public getPointY = (k: Buffer): Buffer => {
        if (k[0] !== 0x04) {
            throw new Error('Unsupported public key format')
        }
        const n = k.slice(1)
    
        return n.slice(32)
    }
    
    public static validatePoint = (x: Buffer, y: Buffer): boolean => {
        const nx = parseInt(x.toString('hex'), 16)
        const ny = parseInt(y.toString('hex'), 16)
        const np = parseInt('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 16)
    
        return ((ny * ny - nx * nx * nx - 7) % np === 0)
    }
}