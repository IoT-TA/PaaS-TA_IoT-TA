"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_token_1 = require("./utils-token");
function getHighlighting(sourceCode) {
    const { tokens, comments } = utils_token_1.extractTokensAndComments(sourceCode);
    const highlights = [];
    for (const token of tokens) {
        switch (token.type) {
            case 'HTMLTagOpen':
            case 'HTMLTagClose':
            case 'HTMLEndTagOpen':
            case 'HTMLSelfClosingTagClose':
            case 'Keyword':
                highlight(token, 'KEYWORD', highlights);
                break;
            case 'HTMLLiteral':
            case 'String':
            case 'Template':
            case 'RegularExpression':
                highlight(token, 'STRING', highlights);
                break;
            case 'Numeric':
                highlight(token, 'CONSTANT', highlights);
                break;
        }
    }
    for (const comment of comments) {
        if ((comment.type === 'Block' && comment.value.startsWith('*')) ||
            comment.type === 'HTMLBogusComment') {
            highlight(comment, 'STRUCTURED_COMMENT', highlights);
        }
        else {
            highlight(comment, 'COMMENT', highlights);
        }
    }
    return { highlights };
}
exports.default = getHighlighting;
function highlight(node, highlightKind, highlights) {
    if (!node.loc) {
        return;
    }
    const startPosition = node.loc.start;
    const endPosition = node.loc.end;
    highlights.push({
        location: {
            startLine: startPosition.line,
            startCol: startPosition.column,
            endLine: endPosition.line,
            endCol: endPosition.column,
        },
        textType: highlightKind,
    });
}
//# sourceMappingURL=highlighter.js.map