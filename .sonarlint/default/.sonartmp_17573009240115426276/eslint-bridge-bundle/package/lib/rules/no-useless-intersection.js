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
// https://jira.sonarsource.com/browse/RSPEC-4335
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
        if (utils_1.isRequiredParserServices(services)) {
            return {
                TSIntersectionType: (node) => {
                    const intersection = node;
                    const anyOrNever = intersection.types.find(typeNode => ['TSAnyKeyword', 'TSNeverKeyword'].includes(typeNode.type));
                    if (anyOrNever) {
                        context.report({
                            message: `Simplify this intersection as it always has type "${anyOrNever.type === 'TSAnyKeyword' ? 'any' : 'never'}".`,
                            node,
                        });
                    }
                    else {
                        intersection.types.forEach(typeNode => {
                            const tp = services.program
                                .getTypeChecker()
                                .getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(typeNode));
                            if (isTypeWithoutMembers(tp)) {
                                context.report({
                                    message: 'Remove this type without members or change this type intersection.',
                                    node: typeNode,
                                });
                            }
                        });
                    }
                },
            };
        }
        return {};
    },
};
function isTypeWithoutMembers(tp) {
    return isNullLike(tp) || (isEmptyInterface(tp) && isStandaloneInterface(tp.symbol));
}
function isNullLike(tp) {
    return (Boolean(tp.flags & ts.TypeFlags.Null) ||
        Boolean(tp.flags & ts.TypeFlags.Undefined) ||
        Boolean(tp.flags & ts.TypeFlags.Void));
}
function isEmptyInterface(tp) {
    return (tp.getProperties().length === 0 &&
        !tp.declaredStringIndexInfo &&
        !tp.declaredNumberIndexInfo);
}
function isStandaloneInterface(typeSymbol) {
    // there is no declarations for `{}`
    // otherwise check that none of declarations has a heritage clause (`extends X` or `implements X`)
    if (!typeSymbol) {
        return false;
    }
    const { declarations } = typeSymbol;
    return (!declarations ||
        declarations.every(declaration => {
            return (isInterfaceDeclaration(declaration) && (declaration.heritageClauses || []).length === 0);
        }));
}
function isInterfaceDeclaration(declaration) {
    return declaration.kind === ts.SyntaxKind.InterfaceDeclaration;
}
//# sourceMappingURL=no-useless-intersection.js.map