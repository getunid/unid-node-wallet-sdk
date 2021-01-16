class ConstManagerKlass {
    constructor() {}

    public get SDS_ENDPOINT_BASE_URI(): string {
        return 'http://localhost:8081'
    }
}

export const ConstManager = new ConstManagerKlass()