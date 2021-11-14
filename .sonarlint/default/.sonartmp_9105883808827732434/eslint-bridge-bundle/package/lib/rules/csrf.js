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
// https://jira.sonarsource.com/browse/RSPEC-4502
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
const utils_1 = require("../utils");
const CSURF_MODULE = 'csurf';
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
exports.rule = {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: ['sonar-runtime'],
            },
        ],
    },
    create(context) {
        let globalCsrfProtection = false;
        let importedCsrfMiddleware = false;
        function checkIgnoredMethods(node) {
            if (node.value.type === 'ArrayExpression') {
                const arrayExpr = node.value;
                const unsafeMethods = arrayExpr.elements
                    .filter(utils_1.isLiteral)
                    .filter(e => typeof e.value === 'string' && !SAFE_METHODS.includes(e.value));
                if (unsafeMethods.length > 0) {
                    const [first, ...rest] = unsafeMethods;
                    context.report({
                        message: locations_1.toEncodedMessage('Make sure disabling CSRF protection is safe here.', rest),
                        node: first,
                    });
                }
            }
        }
        function isCsurfMiddleware(node) {
            if ((node === null || node === void 0 ? void 0 : node.type) === 'Identifier') {
                node = utils_1.getUniqueWriteUsage(context, node.name);
            }
            if (node && node.type === 'CallExpression' && node.callee.type === 'Identifier') {
                const module = utils_1.getModuleNameOfIdentifier(context, node.callee);
                return (module === null || module === void 0 ? void 0 : module.value) === CSURF_MODULE;
            }
            return false;
        }
        function checkCallExpression(callExpression) {
            const { callee } = callExpression;
            // require('csurf')
            const requiredModule = utils_1.getModuleNameFromRequire(callExpression);
            if ((requiredModule === null || requiredModule === void 0 ? void 0 : requiredModule.value) === CSURF_MODULE) {
                importedCsrfMiddleware = true;
            }
            // csurf(...)
            if (callee.type === 'Identifier') {
                const moduleName = utils_1.getModuleNameOfIdentifier(context, callee);
                if ((moduleName === null || moduleName === void 0 ? void 0 : moduleName.value) === CSURF_MODULE) {
                    const [args] = callExpression.arguments;
                    const ignoredMethods = utils_1.getObjectExpressionProperty(args, 'ignoreMethods');
                    if (ignoredMethods) {
                        checkIgnoredMethods(ignoredMethods);
                    }
                }
            }
            // app.use(csurf(...))
            if (callee.type === 'MemberExpression') {
                if (utils_1.isIdentifier(callee.property, 'use') &&
                    utils_1.flattenArgs(context, callExpression.arguments).find(isCsurfMiddleware)) {
                    globalCsrfProtection = true;
                }
                if (utils_1.isIdentifier(callee.property, 'post', 'put', 'delete', 'patch') &&
                    !globalCsrfProtection &&
                    importedCsrfMiddleware &&
                    !callExpression.arguments.some(arg => isCsurfMiddleware(arg))) {
                    context.report({
                        message: locations_1.toEncodedMessage('Make sure not using CSRF protection is safe here.', []),
                        node: callee,
                    });
                }
            }
        }
        return {
            Program() {
                globalCsrfProtection = false;
            },
            CallExpression(node) {
                checkCallExpression(node);
            },
            ImportDeclaration(node) {
                if (node.source.value === CSURF_MODULE) {
                    importedCsrfMiddleware = true;
                }
            },
        };
    },
};
//# sourceMappingURL=csrf.js.map