"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CannotDetermineOutputTypeError extends Error {
    constructor(hostType) {
        super(`Cannot determine a GraphQL output type for the "${hostType}". Make sure your class is decorated with an appropriate decorator.`);
    }
}
exports.CannotDetermineOutputTypeError = CannotDetermineOutputTypeError;
