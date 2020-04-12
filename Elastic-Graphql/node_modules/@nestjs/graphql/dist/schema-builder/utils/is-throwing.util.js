"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isThrowing(func) {
    try {
        func();
        return false;
    }
    catch (_a) {
        return true;
    }
}
exports.isThrowing = isThrowing;
