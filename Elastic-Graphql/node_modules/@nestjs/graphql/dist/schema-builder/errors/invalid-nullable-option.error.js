"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidNullableOptionError extends Error {
    constructor(name, nullable) {
        super(`Incorrect nullable option set for ${name}. Do not combine non-list type with nullable "${nullable}".`);
    }
}
exports.InvalidNullableOptionError = InvalidNullableOptionError;
