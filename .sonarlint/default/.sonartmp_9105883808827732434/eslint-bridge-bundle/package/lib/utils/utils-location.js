"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEncodedMessage = void 0;
function toEncodedMessage(message, secondaryLocationsHolder, secondaryMessages, cost) {
    const encodedMessage = {
        message,
        cost,
        secondaryLocations: secondaryLocationsHolder.map((locationHolder, index) => toSecondaryLocation(locationHolder, !!secondaryMessages ? secondaryMessages[index] : undefined)),
    };
    return JSON.stringify(encodedMessage);
}
exports.toEncodedMessage = toEncodedMessage;
function toSecondaryLocation(locationHolder, message) {
    if (!locationHolder.loc) {
        throw new Error('Invalid secondary location');
    }
    return {
        message,
        column: locationHolder.loc.start.column,
        line: locationHolder.loc.start.line,
        endColumn: locationHolder.loc.end.column,
        endLine: locationHolder.loc.end.line,
    };
}
//# sourceMappingURL=utils-location.js.map