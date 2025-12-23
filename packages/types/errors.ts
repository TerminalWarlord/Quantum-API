import type { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: ContentfulStatusCode,
        public code?: string

    ) {
        super(message);
        Error.captureStackTrace(this, this.constructor)
    }
}

export class UnauthorizedError extends AppError {
    constructor(message="Unauthorized"){
        super(message, 401, "AUTH_ERROR")
    }
};

export class BadRequestError extends AppError {
    constructor(message="Bad request"){
        super(message, 400, "BAD_REQUEST");
    }
};


export class InternalServerError extends AppError {
    constructor(message="Internal server error"){
        super(message, 500, "INTERNAL_SERVER_ERROR");
    }
}

export class NotFoundError extends AppError {
    constructor(message="Not found"){
        super(message, 404, "NOT_FOUND");
    }
}

export class ForbiddenError extends AppError {
    constructor(message="Forbidden"){
        super(message, 403, "FORBIDDEN");
    }
}
