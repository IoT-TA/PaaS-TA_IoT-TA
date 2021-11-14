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
// https://jira.sonarsource.com/browse/RSPEC-2871
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
        if (!utils_1.isRequiredParserServices(services)) {
            return {};
        }
        return {
            CallExpression: (node) => {
                const call = node;
                const callee = call.callee;
                if (call.arguments.length === 0 && callee.type === 'MemberExpression') {
                    const { object, property } = callee;
                    const text = context.getSourceCode().getText(property);
                    if (utils_1.sortLike.includes(text)) {
                        const arrayElementType = arrayElementTypeOf(object, services);
                        if (arrayElementType && arrayElementType.kind === ts.SyntaxKind.NumberKeyword) {
                            context.report({
                                message: 'Provide a compare function to avoid sorting elements alphabetically.',
                                node: property,
                            });
                        }
                    }
                }
            },
        };
    },
};
function arrayElementTypeOf(node, services) {
    const { typeToTypeNode, getTypeAtLocation } = services.program.getTypeChecker();
    const typeNode = typeToTypeNode(getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node)), undefined, undefined);
    if (typeNode && ts.isArrayTypeNode(typeNode)) {
        return typeNode.elementType;
    }
    return undefined;
}
//# sourceMappingURL=no-alphabetical-sort.js.map