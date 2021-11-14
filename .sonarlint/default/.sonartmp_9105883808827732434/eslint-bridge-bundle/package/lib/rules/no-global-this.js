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
// https://jira.sonarsource.com/browse/RSPEC-2990
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = {
    create(context) {
        return {
            'MemberExpression[object.type="ThisExpression"]'(node) {
                const memberExpression = node;
                const scopeType = context.getScope().variableScope.type;
                const isInsideClass = context
                    .getAncestors()
                    .some(ancestor => ancestor.type === 'ClassDeclaration' || ancestor.type === 'ClassExpression');
                if ((scopeType === 'global' || scopeType === 'module') && !isInsideClass) {
                    context.report({
                        message: `Remove the use of "this".`,
                        node: memberExpression.object,
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=no-global-this.js.map