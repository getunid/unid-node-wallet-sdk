export abstract class BaseDataStore {
    abstract insert(): void
    abstract findById(did: string): void
    abstract updateById(did: string): void
    abstract deleteById(did: string): void
}