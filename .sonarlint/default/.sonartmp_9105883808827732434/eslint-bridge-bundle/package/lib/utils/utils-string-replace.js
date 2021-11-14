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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractReferences = exports.isStringReplaceCall = void 0;
const utils_type_1 = require("./utils-type");
const utils_ast_1 = require("./utils-ast");
function isStringReplaceCall(call, services) {
    return (call.callee.type === 'MemberExpression' &&
        call.callee.property.type === 'Identifier' &&
        !call.callee.computed &&
        ['replace', 'replaceAll'].includes(call.callee.property.name) &&
        call.arguments.length > 1 &&
        utils_type_1.isString(call.callee.object, services));
}
exports.isStringReplaceCall = isStringReplaceCall;
function extractReferences(node) {
    const references = [];
    if (utils_ast_1.isStringLiteral(node)) {
        const str = node.value;
        const reg = /\$(\d+)|\$\<([a-zA-Z][a-zA-Z0-9_]*)\>/g;
        let match;
        while ((match = reg.exec(str)) !== null) {
            const [raw, index, name] = match;
            const value = index || name;
            references.push({ raw, value });
        }
    }
    return references;
}
exports.extractReferences = extractReferences;
//# sourceMappingURL=utils-string-replace.js.map