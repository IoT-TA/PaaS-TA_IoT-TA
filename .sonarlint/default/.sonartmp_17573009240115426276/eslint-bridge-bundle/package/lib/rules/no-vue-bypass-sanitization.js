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
exports.rule = void 0;
const message = `Make sure bypassing Vue built-in sanitization is safe here.`;
exports.rule = {
    create(context) {
        const services = context.parserServices;
        function attrsHref(calleeName) {
            // select call expression with given name where second argument is object expression like { attrs: { href: 'bla' } }
            return `CallExpression[callee.name='${calleeName}'] ObjectExpression.arguments:nth-child(2) > Property[key.name='attrs'] > ObjectExpression.value > Property[key.name='href']`;
        }
        const ruleListener = {
            ["JSXAttribute[name.name='domPropsInnerHTML']," +
                "Property[key.name='domProps'] > ObjectExpression.value > Property[key.name='innerHTML']"](node) {
                context.report({ node, message });
            },
            [`${attrsHref('createElement')},${attrsHref('h')}`](node) {
                context.report({ node, message });
            },
        };
        // @ts-ignore
        if (services.defineTemplateBodyVisitor) {
            // analyze <template> in .vue file
            const templateBodyVisitor = context.parserServices.defineTemplateBodyVisitor({
                ["VAttribute[directive=true][key.name.name='html']," +
                    "VAttribute[directive=true][key.argument.name='href']"](node) {
                    context.report({
                        loc: node.loc,
                        message,
                    });
                },
            });
            Object.assign(ruleListener, templateBodyVisitor);
        }
        return ruleListener;
    },
};
//# sourceMappingURL=no-vue-bypass-sanitization.js.map