import HttpStatus from 'http-status-codes'

/**
 */
export class UNiDError extends Error {
    private $code: number

    constructor(code: number, message?: string) {
        if (message === undefined) {
            super(`[code: ${ code }]`)
        } else {
            super(`[code: ${ code }] ${ message }`)
        }

        this.$code = code
    }

    public get code(): number {
        return this.$code
    }
}

/**
 */
export class UNiDNotImplementedError extends UNiDError {
    constructor(message?: string) {
        super(HttpStatus.NOT_IMPLEMENTED, message)
    }
}

/**
 */
export class UNiDInvalidDataError extends UNiDError {
    constructor(message?: string) {
        super(HttpStatus.BAD_REQUEST, message)
    }
}

/**
 */
export class UNiDNotUniqueError extends UNiDError {
    constructor(message?: string) {
        super(HttpStatus.BAD_REQUEST, message)
    }
}

/**
 */
export class UNiDNotCompatibleError extends UNiDError {
    constructor(message?: string) {
        super(HttpStatus.BAD_REQUEST, message)
    }
}