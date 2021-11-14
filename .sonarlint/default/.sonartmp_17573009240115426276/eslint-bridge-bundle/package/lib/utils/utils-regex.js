"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2021 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStringRegexMethodCall = exports.getRegexpRange = exports.getRegexpLocation = exports.getFlags = exports.isRegExpConstructor = exports.getParsedRegex = void 0;
const regexpp = __importStar(require("regexpp"));
const utils_ast_1 = require("./utils-ast");
const utils_string_literal_1 = require("./utils-string-literal");
const utils_type_1 = require("./utils-type");
const utils_collection_1 = require("./utils-collection");
function getParsedRegex(node, context) {
    const patternAndFlags = getPatternFromNode(node, context);
    if (patternAndFlags) {
        try {
            return regexpp.parseRegExpLiteral(new RegExp(patternAndFlags.pattern, patternAndFlags.flags));
        }
        catch (_a) {
            // do nothing for invalid regex
        }
    }
    return null;
}
exports.getParsedRegex = getParsedRegex;
function getPatternFromNode(node, context) {
    var _a;
    if (isRegExpConstructor(node)) {
        const patternOnly = getPatternFromNode(node.arguments[0], context);
        const flags = getFlags(node);
        if (patternOnly && flags !== null) {
            return { pattern: patternOnly.pattern, flags };
        }
    }
    else if (utils_ast_1.isRegexLiteral(node)) {
        return node.regex;
    }
    else if (utils_ast_1.isStringLiteral(node)) {
        return { pattern: node.value, flags: '' };
    }
    else if (utils_ast_1.isStaticTemplateLiteral(node)) {
        return { pattern: node.quasis[0].value.raw, flags: '' };
    }
    else if (utils_ast_1.isIdentifier(node)) {
        const assignedExpression = utils_ast_1.getUniqueWriteUsage(context, node.name);
        if (assignedExpression &&
            ((_a = assignedExpression.parent) === null || _a === void 0 ? void 0 : _a.type) === 'VariableDeclarator') {
            return getPatternFromNode(assignedExpression, context);
        }
    }
    else if (utils_ast_1.isBinaryPlus(node)) {
        const left = getPatternFromNode(node.left, context);
        const right = getPatternFromNode(node.right, context);
        if (left && right) {
            return { pattern: left.pattern + right.pattern, flags: '' };
        }
    }
    return null;
}
function isRegExpWithGlobalThis(node) {
    return (node.type === 'NewExpression' &&
        node.callee.type === 'MemberExpression' &&
        utils_ast_1.isIdentifier(node.callee.object, 'globalThis') &&
        utils_ast_1.isIdentifier(node.callee.property, 'RegExp') &&
        node.arguments.length > 0);
}
function isRegExpConstructor(node) {
    return (((node.type === 'CallExpression' || node.type === 'NewExpression') &&
        node.callee.type === 'Identifier' &&
        node.callee.name === 'RegExp' &&
        node.arguments.length > 0) ||
        isRegExpWithGlobalThis(node));
}
exports.isRegExpConstructor = isRegExpConstructor;
function getFlags(callExpr) {
    if (callExpr.arguments.length < 2) {
        return '';
    }
    const flags = callExpr.arguments[1];
    if (flags.type === 'Literal' && typeof flags.value === 'string') {
        return flags.value;
    }
    return null;
}
exports.getFlags = getFlags;
function getRegexpLocation(node, regexpNode, context, offset = [0, 0]) {
    let loc;
    if (utils_ast_1.isRegexLiteral(node) || utils_ast_1.isStringLiteral(node)) {
        const source = context.getSourceCode();
        const [start] = node.range;
        const [reStart, reEnd] = getRegexpRange(node, regexpNode);
        loc = {
            start: source.getLocFromIndex(start + reStart + offset[0]),
            end: source.getLocFromIndex(start + reEnd + offset[1]),
        };
    }
    else {
        loc = node.loc;
    }
    return loc;
}
exports.getRegexpLocation = getRegexpLocation;
function getRegexpRange(node, regexpNode) {
    if (utils_ast_1.isRegexLiteral(node)) {
        return [regexpNode.start, regexpNode.end];
    }
    if (utils_ast_1.isStringLiteral(node)) {
        if (node.value === '') {
            return [0, 2];
        }
        const s = node.raw;
        const tokens = utils_string_literal_1.tokenizeString(unquote(s));
        if (regexpNode.start === regexpNode.end) {
            // this happens in case of empty alternative node like '|'
            if (regexpNode.start - 1 < tokens.length) {
                // '|' first empty alternative will have start = 1, end = 1
                // +1 is to account for string quote
                return [
                    tokens[regexpNode.start - 1].range[0] + 1,
                    tokens[regexpNode.start - 1].range[0] + 1,
                ];
            }
            else {
                // '|' second empty alternative regex node will have start = 2, end = 2
                // +1 is to account for string quote
                return [utils_collection_1.last(tokens).range[1] + 1, utils_collection_1.last(tokens).range[1] + 1];
            }
        }
        // regexpNode positions are 1 - based, we need to -1 to report as 0 - based
        // it's possible for node start to be outside of range, e.g. `a` in new RegExp('//a')
        const startToken = regexpNode.start - 1;
        const start = tokens[startToken].range[0];
        // it's possible for node end to be outside of range, e.g. new RegExp('\n(|)')
        const endToken = Math.min(regexpNode.end - 2, tokens.length - 1);
        const end = tokens[endToken].range[1];
        // +1 is needed to account for string quotes
        return [start + 1, end + 1];
    }
    if (node.type === 'TemplateLiteral') {
        // we don't support these properly
        return node.range;
    }
    throw new Error(`Expected regexp or string literal, got ${node.type}`);
}
exports.getRegexpRange = getRegexpRange;
function unquote(s) {
    if (s.charAt(0) !== "'" && s.charAt(0) !== '"') {
        throw new Error(`invalid string to unquote: ${s}`);
    }
    return s.substring(1, s.length - 1);
}
function isStringRegexMethodCall(call, services) {
    return (call.callee.type === 'MemberExpression' &&
        call.callee.property.type === 'Identifier' &&
        !call.callee.computed &&
        ['match', 'matchAll', 'search'].includes(call.callee.property.name) &&
        call.arguments.length > 0 &&
        utils_type_1.isString(call.callee.object, services) &&
        utils_type_1.isString(call.arguments[0], services));
}
exports.isStringRegexMethodCall = isStringRegexMethodCall;
//# sourceMappingURL=utils-regex.js.map