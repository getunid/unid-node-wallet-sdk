import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import { BaseConnector, MnemonicKeyringModel } from 'src/connector/base'
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
    connector: BaseConnector
    context  : BIP39Context
    sign     : Secp256k1
    update   : Secp256k1
    recovery : Secp256k1
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
    private keyring? : MnemonicKeyringModel

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
     * @param keyring 
     */
    private setKeyring(keyring: MnemonicKeyringModel): void {
        this.keyring = keyring
    }

    /**
     */
    private async saveContext(did?: string): Promise<MnemonicKeyringModel> {
        const keyring = await this.connector.upsert({
            did     : did,
            sign    : this.sign.toHexKeyPair(),
            update  : this.update.toHexKeyPair(),
            recovery: this.recovery.toHexKeyPair(),
            seed    : this.context.seed.toString('hex'),
            mnemonic: this.context.mnemonic,
        })

        return keyring
    }

    public async setDid(did: string): Promise<MnemonicKeyringModel> {
        const item = await this.connector.findByDid(did)

        if (! item) {
            throw new Error()
        }
        this.setKeyring(await this.saveContext(did))

        return item
    }

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
        instance.setKeyring(await instance.saveContext())

        return instance
    }

    /**
     * @param connector 
     */
    public static async loadKeyring(connector: BaseConnector, did: string): Promise<MnemonicKeyring> {
        const keyring = await connector.findByDid(did)

        if (! keyring) {
            throw new Error()
        }

        const context: BIP39Context = {
            mnemonic: keyring.mnemonic,
            seed    : Buffer.from(keyring.seed, 'hex'),
        }
        const sign: Secp256k1 = new Secp256k1({
            public : Buffer.from(keyring.sign.public , 'hex'),
            private: Buffer.from(keyring.sign.private, 'hex'),
        })
        const update: Secp256k1 = new Secp256k1({
            public : Buffer.from(keyring.update.public , 'hex'),
            private: Buffer.from(keyring.update.private, 'hex')
        })
        const recovery: Secp256k1 = new Secp256k1({
            public : Buffer.from(keyring.recovery.public , 'hex'),
            private: Buffer.from(keyring.recovery.private, 'hex')
        })
        const instance = new MnemonicKeyring({
            connector: connector,
            context  : context,
            sign     : sign,
            update   : update,
            recovery : recovery,
        })
        instance.setKeyring(keyring)

        return instance
    }

    /**
     */
    public get identifier(): string {
        if ((! this.keyring) || (! this.keyring.did)) {
            throw new Error()
        }

        return this.keyring.did
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
    public async verifySeedPhrase(phrase: Array<string>, isPersistent: boolean = false): Promise<boolean> {
        const mnemonic = phrase.map((v) => { return v.trim() }).join(' ')
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