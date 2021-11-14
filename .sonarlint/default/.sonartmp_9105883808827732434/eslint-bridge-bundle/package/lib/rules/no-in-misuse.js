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
// https://jira.sonarsource.com/browse/RSPEC-4619
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
const message = 'Use "indexOf" or "includes" (available from ES2016) instead.';
exports.rule = {
    create(context) {
        const services = context.parserServices;
        function prototypeProperty(node) {
            const expr = node;
            if (!nodes_1.isLiteral(expr) || typeof expr.value !== 'string') {
                return false;
            }
            return ['indexOf', 'lastIndexOf', 'forEach', 'map', 'filter', 'every', 'some'].includes(expr.value);
        }
        if (utils_1.isRequiredParserServices(services)) {
            return {
                "BinaryExpression[operator='in']": (node) => {
                    const binExpr = node;
                    if (utils_1.isArray(binExpr.right, services) &&
                        !prototypeProperty(binExpr.left) &&
                        !utils_1.isNumber(binExpr.left, services)) {
                        context.report({
                            message,
                            node,
                        });
                    }
                },
            };
        }
        return {};
    },
};
//# sourceMappingURL=no-in-misuse.js.map