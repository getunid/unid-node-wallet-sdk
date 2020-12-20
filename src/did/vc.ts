export class VerifiableCredential<T> {
    private credential: T

    constructor(credential: T) {
        this.credential = credential
    }

    public sign() {
    }

    public verify() {
    }
}