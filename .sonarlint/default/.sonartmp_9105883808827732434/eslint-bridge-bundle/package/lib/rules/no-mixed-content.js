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
// https://jira.sonarsource.com/browse/RSPEC-5730
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const utils_express_1 = require("./utils-express");
const HELMET = 'helmet';
const HELMET_CSP = 'helmet-csp';
const DIRECTIVES = 'directives';
const CONTENT_SECURITY_POLICY = 'contentSecurityPolicy';
const BLOCK_ALL_MIXED_CONTENT_CAMEL = 'blockAllMixedContent';
const BLOCK_ALL_MIXED_CONTENT_HYPHEN = 'block-all-mixed-content';
exports.rule = utils_express_1.Express.SensitiveMiddlewarePropertyRule(findDirectivesWithMissingMixedContentPropertyFromHelmet, `Make sure allowing mixed-content is safe here.`);
function findDirectivesWithMissingMixedContentPropertyFromHelmet(context, node) {
    let sensitive;
    const { arguments: args } = node;
    if (args.length === 1) {
        const [options] = args;
        const maybeDirectives = utils_1.getObjectExpressionProperty(options, DIRECTIVES);
        if (maybeDirectives &&
            isMissingMixedContentProperty(maybeDirectives) &&
            isValidHelmetModuleCall(context, node)) {
            sensitive = maybeDirectives;
        }
    }
    return sensitive ? [sensitive] : [];
}
function isValidHelmetModuleCall(context, callExpr) {
    var _a;
    const { callee } = callExpr;
    /* csp(options) */
    if (callee.type === 'Identifier' && ((_a = utils_1.getModuleNameOfNode(context, callee)) === null || _a === void 0 ? void 0 : _a.value) === HELMET_CSP) {
        return true;
    }
    /* helmet.contentSecurityPolicy(options) */
    return utils_1.isCallToFQN(context, callExpr, HELMET, CONTENT_SECURITY_POLICY);
}
function isMissingMixedContentProperty(directives) {
    return !(Boolean(utils_1.getObjectExpressionProperty(directives.value, BLOCK_ALL_MIXED_CONTENT_CAMEL)) ||
        Boolean(utils_1.getObjectExpressionProperty(directives.value, BLOCK_ALL_MIXED_CONTENT_HYPHEN)));
}
//# sourceMappingURL=no-mixed-content.js.map