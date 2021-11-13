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
// https://jira.sonarsource.com/browse/RSPEC-3001
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = {
    create(context) {
        return {
            "UnaryExpression[operator='delete'][argument.type!='MemberExpression']": (node) => {
                const { argument } = node;
                if (!isGlobalProperty(argument, context.getScope().references)) {
                    context.report({
                        message: 'Remove this "delete" operator or pass an object property to it.',
                        node,
                    });
                }
            },
        };
    },
};
function isGlobalProperty(expr, references) {
    return (expr.type === 'Identifier' &&
        references.filter(ref => ref.identifier.name === expr.name && ref.resolved).length === 0);
}
//# sourceMappingURL=no-delete-var.js.map