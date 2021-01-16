import { Hasher } from "../cipher/hasher"
import { ConfigManager } from "../config"
import { UNiDVerifiableCredential, UNiDVerifiablePresentation, UNiDVerifiablePresentationMetadata } from "../schemas"
import { SDSOperationCredentialV1Types } from "../schemas/internal/sds-operation"
import { ConstManager } from "../const"
import { UNiDNotImplementedError } from "../error"
import { HttpClient } from "../utils/http-client"

interface UNiDSDSOperatorContext {
    debug?: boolean
    endpoint?: string
}

/**
 */
interface SDSRequest {
    payload: string,
}

/**
 */
interface SDSCreateRequest {
    payload: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, SDSOperationCredentialV1Types>> & UNiDVerifiablePresentationMetadata
}

/**
 */
interface SDSCreateResponse {
}

/**
 */
interface SDSFindRequest {
    payload: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, SDSOperationCredentialV1Types>> & UNiDVerifiablePresentationMetadata
}

/**
 */
interface SDSFindResponse {
}

/**
 */
interface SDSFindOneRequest {
    payload: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, SDSOperationCredentialV1Types>> & UNiDVerifiablePresentationMetadata
}

/**
 */
interface SDSFindOneResponse {
}

/**
 */
interface SDSUpdateRequest {
    payload: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, SDSOperationCredentialV1Types>> & UNiDVerifiablePresentationMetadata
}

/**
 */
interface SDSUpdateResponse {
}

/**
 */
interface SDSDeleteRequest {
    payload: UNiDVerifiablePresentation<UNiDVerifiableCredential<string, string, SDSOperationCredentialV1Types>> & UNiDVerifiablePresentationMetadata
}

/**
 */
interface SDSDeleteResponse {
}

export class UNiDSDSOperator {
    private static readonly REQUEST_HEADER_KEY: string = 'X-REQUEST-DIGEST'

    private readonly debug: boolean
    private readonly endpoint: string
    private readonly client: HttpClient

    /**
     * @param context 
     */
    constructor(context?: UNiDSDSOperatorContext) {
        if ((context !== undefined) && (context.debug !== undefined)) {
            this.debug = context.debug
        } else {
            this.debug = false
        }

        if ((context !== undefined) && (context.endpoint !== undefined)) {
            this.endpoint = context.endpoint
        } else {
            this.endpoint = ConstManager.SDS_ENDPOINT_BASE_URI
        }

        this.client = HttpClient.new({
            baseURL: this.endpoint,
        }, {
            debug: this.debug,
        })
    }

    /**
     * @param request 
     */
    public async create(request: SDSCreateRequest): Promise<SDSCreateResponse> {
        const URI = '/api/v1/create'

        try {
            const context: SDSRequest = {
                payload: JSON.stringify(request.payload)
            }
            const digest = Hasher.generateRequestDigest(URI, context.payload, {
                clientSecret: ConfigManager.context.clientSecret,
            })
            const response = await this.client.setHeaders({
                [UNiDSDSOperator.REQUEST_HEADER_KEY]: digest,
            }).agent.post<SDSCreateResponse>(URI, context)

            return response.data
        } catch (err) {
            throw err
        }
    }

    /**
     * @param request 
     */
    public async find(request: SDSFindRequest): Promise<SDSFindResponse> {
        const URI = '/api/v1/find'

        try {
            const context: SDSRequest = {
                payload: JSON.stringify(request.payload)
            }
            const digest = Hasher.generateRequestDigest(URI, context.payload, {
                clientSecret: ConfigManager.context.clientSecret,
            })
            const response = await this.client.setHeaders({
                [UNiDSDSOperator.REQUEST_HEADER_KEY]: digest,
            }).agent.post<SDSFindResponse>(URI, context)

            return response.data
        } catch (err) {
            throw err
        }
    }

    /**
     * @param request 
     */
    public async findOne(request: SDSFindOneRequest): Promise<SDSFindOneResponse> {
        const URI = '/api/v1/findOne'

        try {
            const context: SDSRequest = {
                payload: JSON.stringify(request.payload)
            }
            const digest = Hasher.generateRequestDigest(URI, context.payload, {
                clientSecret: ConfigManager.context.clientSecret,
            })
            const response = await this.client.setHeaders({
                [UNiDSDSOperator.REQUEST_HEADER_KEY]: digest,
            }).agent.post<SDSFindOneResponse>(URI, context)

            return response.data
        } catch (err) {
            throw err
        }
    }

    /**
     * @param request 
     */
    public async update(request: SDSUpdateRequest): Promise<SDSUpdateResponse> {
        try {
            throw new UNiDNotImplementedError()
        } catch (err) {
            throw err
        }
    }

    /**
     * @param request 
     */
    public async delete(request: SDSDeleteRequest): Promise<SDSDeleteResponse> {
        try {
            throw new UNiDNotImplementedError()
        } catch (err) {
            throw err
        }
    }

    // /**
    //  * @param params 
    //  */
    // public async resolve(params: DIDResolutionRequest): Promise<UNiDDidDocument> {
    //     try {
    //         const response = await this.client.agent.get<DIDResolutionResponse>(`/api/v1/identifiers/${ params.did }`)

    //         return new UNiDDidDocument(response.data.didDocument)
    //     } catch (err) {
    //         throw new err
    //     }
    // }

    // /**
    //  * @param params 
    //  */
    // public async create(params: DIDCreateRequest): Promise<UNiDDidDocument> {
    //     try {
    //         const payload  = didCreatePayload(params)
    //         const response = await this.client.agent.post<DIDCreateResponse>('/api/v1/operations', payload)

    //         return new UNiDDidDocument(response.data.didDocument)
    //     } catch (err) {
    //         throw new err
    //     }
    // }

    // /**
    //  */
    // public async update(): Promise<void> {
    //     throw new Error('NOT IMPLEMENTED')
    // }

    // /**
    //  */
    // public async recover(): Promise<void> {
    //     throw new Error('NOT IMPLEMENTED')
    // }

    // /**
    //  */
    // public async deactivate(): Promise<void> {
    //     throw new Error('NOT IMPLEMENTED')
    // }
}