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
// https://jira.sonarsource.com/browse/RSPEC-3525
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
exports.rule = void 0;
const ts = __importStar(require("typescript"));
const utils_1 = require("../utils");
exports.rule = {
    create(context) {
        const services = context.parserServices;
        const isFunction = utils_1.isRequiredParserServices(services) ? isFunctionType : isFunctionLike;
        return {
            AssignmentExpression: (node) => {
                const { left, right } = node;
                if (left.type === 'MemberExpression' && isFunction(right, services)) {
                    const [member, prototype] = [left.object, left.property];
                    if (member.type === 'MemberExpression' && prototype.type === 'Identifier') {
                        const [klass, property] = [member.object, member.property];
                        if (klass.type === 'Identifier' &&
                            property.type === 'Identifier' &&
                            property.name === 'prototype') {
                            context.report({
                                message: `Declare a "${klass.name}" class and move this declaration of "${prototype.name}" into it.`,
                                node: left,
                            });
                        }
                    }
                }
            },
        };
    },
};
function isFunctionType(node, services) {
    const type = utils_1.getTypeFromTreeNode(node, services);
    return type.symbol && (type.symbol.flags & ts.SymbolFlags.Function) !== 0;
}
function isFunctionLike(node, _services) {
    return ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(node.type);
}
//# sourceMappingURL=class-prototype.js.map