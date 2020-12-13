import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import { Secp256k1 } from './secp256k1'

interface BIP39Context {
    seed: Buffer,
    mnemonic: string,
}

type BIP39PhraseSize =
    | 12 // ENT = 128, CS = 4, ENT + CS = 132, MS = 12
    | 15 // ENT = 160, CS = 5, ENT + CS = 165, MS = 15
    | 18 // ENT = 192, CS = 6, ENT + CS = 198, MS = 18
    | 21 // ENT = 224, CS = 7, ENT + CS = 231, MS = 21
    | 24 // ENT = 256, CS = 8, ENT + CS = 264, MS = 24

const BIP39DefaultPhraseSize: BIP39PhraseSize = 24

export interface MnemonicKeyringOptions {
    length: BIP39PhraseSize
}

interface MnemonicKeyringContext {
    context: BIP39Context
    sign   : Secp256k1
    update : Secp256k1
    recover: Secp256k1
}

class MnemonicKeyringKlass {
    private static readonly baseDerivationPath: string = 'm/44\'/0\'/0\'/0'

    public static readonly signDerivationPath: string    = `${ MnemonicKeyringKlass.baseDerivationPath }/0`
    public static readonly updateDerivationPath: string  = `${ MnemonicKeyringKlass.baseDerivationPath }/1`
    public static readonly recoverDerivationPath: string = `${ MnemonicKeyringKlass.baseDerivationPath }/2`

    private context: BIP39Context
    private sign   : Secp256k1
    private update : Secp256k1
    private recover: Secp256k1

    /**
     * @param context 
     */
    public constructor(context: MnemonicKeyringContext) {
        this.context = context.context
        this.sign    = context.sign
        this.update  = context.update
        this.recover = context.recover
    }

    /**
     */
    public getSeedPhrases(): Array<string> {
        return this.context.mnemonic.split(' ')
    }

    /**
     * @param seeds 
     * @param persistent 
     */
    public verifySeedPhrase(seeds: Array<string>, isPersistent: boolean = false): boolean {
        const mnemonic = seeds.map((v) => { return v.trim() }).join(' ')
        const isValid  = (this.context.mnemonic === mnemonic)

        if (isValid) {
            if (! isPersistent) {
                // Remove mnemonic phrase from local datastore
            }
        }

        return isValid
    }

    /**
     */
    public get signKeyPair(): Secp256k1 {
        return this.sign
    }

    /**
     */
    public get updateKeyPair(): Secp256k1 {
        return this.update
    }

    /**
     */
    public get recoverKeyPair(): Secp256k1 {
        return this.recover
    }

    /**
     * @param context 
     * @param derivationPath 
     */
    public static async generateSecp256k1(context: BIP39Context, derivationPath: string): Promise<Secp256k1> {
        const node = await MnemonicKeyringKlass.generateHDNodeByDerivationPath(context, derivationPath)

        return new Secp256k1({
            public : node.publicKey  || Buffer.from([]),
            private: node.privateKey || Buffer.from([]),
        })
    }

    /**
     * @param options 
     */
    public static async generateBip39Seed(options?: MnemonicKeyringOptions): Promise<BIP39Context> {
        const fromSize = (size: BIP39PhraseSize): number => {
            switch (size) {
                case 12: { return 128 }
                case 15: { return 160 }
                case 18: { return 192 }
                case 21: { return 224 }
                case 24: { return 256 }
                default: { throw new Error() }
            }
        }

        if (! options) {
            options = {
                length: BIP39DefaultPhraseSize
            }
        }

        const mnemonic = bip39.generateMnemonic(fromSize(options.length))
        const seed     = await bip39.mnemonicToSeed(mnemonic)
    
        return {
            mnemonic: mnemonic,
            seed    : seed,
        }
    }
    
    /**
     * @param context 
     * @param derivationPath 
     */
    public static async generateHDNodeByDerivationPath(context: BIP39Context, derivationPath: string): Promise<bip32.BIP32Interface> {
        const root  = bip32.fromSeed(context.seed)
        const child = root.derivePath(derivationPath)
    
        return child
    }
}

/**
 * @param options 
 */
const createKeyring = async (options?: MnemonicKeyringOptions): Promise<MnemonicKeyringKlass> => {
    const context = await MnemonicKeyringKlass.generateBip39Seed(options)
    const sign    = await MnemonicKeyringKlass.generateSecp256k1(context, MnemonicKeyringKlass.signDerivationPath)
    const update  = await MnemonicKeyringKlass.generateSecp256k1(context, MnemonicKeyringKlass.updateDerivationPath)
    const recover = await MnemonicKeyringKlass.generateSecp256k1(context, MnemonicKeyringKlass.recoverDerivationPath)

    return new MnemonicKeyringKlass({
        context: context,
        sign   : sign,
        update : update,
        recover: recover,
    })
}

/**
 */
const loadKeyring = async () => {
}

export const MnemonicKeyring = {
    createKeyring,
    loadKeyring,
}