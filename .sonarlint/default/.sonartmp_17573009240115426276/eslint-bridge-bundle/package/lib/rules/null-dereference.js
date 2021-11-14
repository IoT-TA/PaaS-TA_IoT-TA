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
// https://jira.sonarsource.com/browse/RSPEC-22259
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (!utils_1.isRequiredParserServices(services)) {
            return {};
        }
        const alreadyRaisedSymbols = new Set();
        function checkNullDereference(node) {
            var _a;
            if (node.type !== 'Identifier') {
                return;
            }
            const scope = context.getScope();
            const symbol = (_a = scope.references.find(v => v.identifier === node)) === null || _a === void 0 ? void 0 : _a.resolved;
            if (!symbol) {
                return;
            }
            const enclosingFunction = context.getAncestors().find(n => utils_1.functionLike.has(n.type));
            if (!alreadyRaisedSymbols.has(symbol) &&
                !isWrittenInInnerFunction(symbol, enclosingFunction) &&
                utils_1.isUndefinedOrNull(node, services)) {
                alreadyRaisedSymbols.add(symbol);
                context.report({
                    message: `TypeError can be thrown as "${node.name}" might be null or undefined here.`,
                    node,
                });
            }
        }
        function isWrittenInInnerFunction(symbol, fn) {
            return symbol.references.some(ref => {
                if (ref.isWrite() && ref.identifier.hasOwnProperty('parent')) {
                    const enclosingFn = utils_1.findFirstMatchingAncestor(ref.identifier, node => utils_1.functionLike.has(node.type));
                    return enclosingFn && enclosingFn !== fn;
                }
                return false;
            });
        }
        return {
            MemberExpression(node) {
                const { object } = node;
                checkNullDereference(object);
            },
            ForOfStatement(node) {
                const { right } = node;
                checkNullDereference(right);
            },
            'Program:exit'() {
                alreadyRaisedSymbols.clear();
            },
        };
    },
};
//# sourceMappingURL=null-dereference.js.map