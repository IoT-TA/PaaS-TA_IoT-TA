"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
function getCpdTokens(sourceCode) {
    const cpdTokens = [];
    const tokens = sourceCode.ast.tokens;
    const jsxTokens = extractJSXTokens(sourceCode);
    tokens.forEach(token => {
        let text = token.value;
        if (text.trim().length === 0) {
            // for EndOfFileToken and JsxText tokens containing only whitespaces
            return;
        }
        if (isStringLiteralToken(token) && !jsxTokens.includes(token)) {
            text = 'LITERAL';
        }
        const startPosition = token.loc.start;
        const endPosition = token.loc.end;
        cpdTokens.push({
            location: {
                startLine: startPosition.line,
                startCol: startPosition.column,
                endLine: endPosition.line,
                endCol: endPosition.column,
            },
            image: text,
        });
    });
    return { cpdTokens };
}
exports.default = getCpdTokens;
function extractJSXTokens(sourceCode) {
    const tokens = [];
    utils_1.visit(sourceCode, (node) => {
        var _a;
        const tsNode = node;
        if (tsNode.type === 'JSXAttribute' && ((_a = tsNode.value) === null || _a === void 0 ? void 0 : _a.type) === 'Literal') {
            tokens.push(...sourceCode.getTokens(tsNode.value));
        }
    });
    return tokens;
}
function isStringLiteralToken(token) {
    return token.value.startsWith('"') || token.value.startsWith("'") || token.value.startsWith('`');
}
//# sourceMappingURL=cpd.js.map