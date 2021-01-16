import axios, { AxiosInstance, CancelTokenSource, AxiosRequestConfig } from "axios"
import lodash from 'lodash'
import { Logging } from "./logging"

type KV = { [ key : string ]: string }

export enum HttpRequestMethod {
    GET     = 'GET',
    HEAD    = 'HEAD',
    POST    = 'POST',
    PUT     = 'PUT',
    DELETE  = 'DELETE',
    CONNECT = 'CONNECT',
    OPTIONS = 'OPTIONS',
    TRACE   = 'TRACE',
    PATCH   = 'PATCH',
}

interface HttpClientContext {
    debug?: boolean
}

export class HttpClient {
    private $timeout: number | undefined
    private $baseUri: string | undefined
    private $headers: KV

    private $logging: Logging
    private $handler: CancelTokenSource
    private $instance: AxiosInstance

    private context?: HttpClientContext

    private constructor(config?: AxiosRequestConfig, context?: HttpClientContext) {
        let cancel = axios.CancelToken

        this.context   = context
        this.$headers  = {}
        this.$logging  = new Logging()
        this.$handler  = cancel.source()
        this.$instance = (config) ? axios.create({
            ...config,
            cancelToken: this.$handler.token,
        }) : axios.create({
            cancelToken: this.$handler.token,
        })

        this.initialize()
    }

    private initialize() {
        // Inspect of the http request
        this.$instance.interceptors.request.use((request) => {
            // set headers
            let common  = lodash.defaults<KV, KV>(this.$headers, request.headers.common)
            let headers = lodash.defaults<{ [ key: string ]: KV }, { [ key: string ]: KV }>({ common: common }, request.headers)

            request.headers = headers

            // set base-uri
            if (this.$baseUri !== undefined) {
                request.baseURL = this.$baseUri
            }

            // set timeout
            if (this.$timeout !== undefined) {
                request.timeout = this.$timeout
            }

            if (this.context && this.context.debug) {
                this.$logging.info('axios (request):', request)
            }

            return request
        }, (error) => {
            if (this.context && this.context.debug) {
                this.$logging.err('axios (request)', error)
            }

            return Promise.reject(error)
        })

        // Inspect of the http response
        this.$instance.interceptors.response.use((response) => {
            if (this.context && this.context.debug) {
                this.$logging.info('axios (response):', response)
            }

            return response
        }, (error) => {
            if (this.context && this.context.debug) {
                this.$logging.err('axios (response):', error)
            }

            return Promise.reject(error)
        })
    }

    public static new(config?: AxiosRequestConfig, context?: HttpClientContext): HttpClient {
        return new HttpClient(config, context)
    }

    public get agent(): AxiosInstance {
        return this.$instance
    }

    public cancel() {
        this.$handler.cancel()
    }

    public setBaseUri(uri: string): HttpClient {
        this.$baseUri = uri

        return this
    }

    public setTimeout(timeout: number): HttpClient {
        this.$timeout = timeout

        return this
    }

    public setHeaders(headers: KV): HttpClient {
        Object.keys(headers).map((k) => {
            let v  = headers[k]
            let nk = k.toLowerCase()

            delete headers[k]

            headers[nk] = v
        })

        this.$headers = lodash.defaults<KV, KV>(headers, this.$headers)

        return this
    }
}