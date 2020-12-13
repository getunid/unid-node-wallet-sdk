import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import { BaseConnector } from 'src/connector/base'
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

export interface MnemonicKeyringModel {
    did?     : string
    context  : BIP39Context
    sign     : Secp256k1
    update   : Secp256k1
    recovery : Secp256k1
}

interface MnemonicKeyringContext extends MnemonicKeyringModel {
    connector: BaseConnector
}

export class MnemonicKeyring {
    private static readonly baseDerivationPath: string = 'm/44\'/0\'/0\'/0'

    public static readonly signDerivationPath: string     = `${ MnemonicKeyring.baseDerivationPath }/0`
    public static readonly updateDerivationPath: string   = `${ MnemonicKeyring.baseDerivationPath }/1`
    public static readonly recoveryDerivationPath: string = `${ MnemonicKeyring.baseDerivationPath }/2`

    private connector: BaseConnector
    private context  : BIP39Context
    private sign     : Secp256k1
    private update   : Secp256k1
    private recovery : Secp256k1

    /**
     * @param context 
     */
    private constructor(context: MnemonicKeyringContext) {
        this.connector = context.connector
        this.context   = context.context
        this.sign      = context.sign
        this.update    = context.update
        this.recovery  = context.recovery
    }

    /**
     */
    private async save() {
        return await this.connector.upsert({
            did     : undefined,
            context : this.context,
            sign    : this.sign,
            update  : this.update,
            recovery: this.recovery
        })
    }

    // private async load(did: string) {
    //     return await this.connector.findById(did)
    // }

    /**
     * @param connector 
     * @param options 
     */
    public static async createKeyring(connector: BaseConnector, options?: MnemonicKeyringOptions): Promise<MnemonicKeyring> {
        const context  = await MnemonicKeyring.generateBip39Seed(options)
        const sign     = await MnemonicKeyring.generateSecp256k1(context, MnemonicKeyring.signDerivationPath)
        const update   = await MnemonicKeyring.generateSecp256k1(context, MnemonicKeyring.updateDerivationPath)
        const recovery = await MnemonicKeyring.generateSecp256k1(context, MnemonicKeyring.recoveryDerivationPath)
        const instance = new MnemonicKeyring({
            connector: connector,
            context  : context,
            sign     : sign,
            update   : update,
            recovery : recovery,
        })
        await instance.save()

        return instance
    }

    /**
     * @param connector 
     */
    public static loadKeyring(connector: BaseConnector) {
    }

    /**
     */
    public get identifier(): string {
        return ''
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
    public async verifySeedPhrase(seeds: Array<string>, isPersistent: boolean = false): Promise<boolean> {
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
    public get recoveryKeyPair(): Secp256k1 {
        return this.recovery
    }

    /**
     * @param context 
     * @param derivationPath 
     */
    public static async generateSecp256k1(context: BIP39Context, derivationPath: string): Promise<Secp256k1> {
        const node = await MnemonicKeyring.generateHDNodeByDerivationPath(context, derivationPath)

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