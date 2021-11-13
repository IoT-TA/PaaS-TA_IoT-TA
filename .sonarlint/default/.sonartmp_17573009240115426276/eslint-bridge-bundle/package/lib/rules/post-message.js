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
// https://jira.sonarsource.com/browse/RSPEC-2819
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const MESSAGE = `Verify the message's origin in this cross-origin communication.`;
const POST_MESSAGE = 'postMessage';
const ADD_EVENT_LISTENER = 'addEventListener';
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (!utils_1.isRequiredParserServices(services)) {
            return {};
        }
        return {
            [`CallExpression:matches([callee.name="${POST_MESSAGE}"], [callee.property.name="${POST_MESSAGE}"])`]: (node) => {
                checkPostMessageCall(node, context);
            },
            [`CallExpression[callee.property.name="${ADD_EVENT_LISTENER}"]`]: (node) => {
                checkAddEventListenerCall(node, context);
            },
        };
    },
};
function isWindowObject(node, context) {
    const type = utils_1.getTypeAsString(node, context.parserServices);
    const hasWindowName = WindowNameVisitor.containsWindowName(node, context);
    return type.match(/window/i) || type.match(/globalThis/i) || hasWindowName;
}
function checkPostMessageCall(callExpr, context) {
    var _a;
    const { callee } = callExpr;
    // Window.postMessage() can take 2 or 3 arguments
    if (![2, 3].includes(callExpr.arguments.length) ||
        ((_a = utils_1.getValueOfExpression(context, callExpr.arguments[1], 'Literal')) === null || _a === void 0 ? void 0 : _a.value) !== '*') {
        return;
    }
    if (callee.type === 'Identifier') {
        context.report({
            node: callee,
            message: MESSAGE,
        });
    }
    if (callee.type !== 'MemberExpression') {
        return;
    }
    if (isWindowObject(callee.object, context)) {
        context.report({
            node: callee,
            message: MESSAGE,
        });
    }
}
function checkAddEventListenerCall(callExpr, context) {
    const { callee, arguments: args } = callExpr;
    if (!isWindowObject(callee, context) ||
        args.length < 2 ||
        !isMessageTypeEvent(args[0], context)) {
        return;
    }
    const listener = utils_1.resolveFunction(context, args[1]);
    if (!listener || listener.params.length === 0) {
        return;
    }
    const event = listener.params[0];
    if (event.type !== 'Identifier') {
        return;
    }
    const hasVerifiedOrigin = EventListenerVisitor.isSenderIdentityVerified(listener.body, event, context);
    if (!hasVerifiedOrigin) {
        context.report({
            node: callee,
            message: MESSAGE,
        });
    }
}
function isMessageTypeEvent(eventNode, context) {
    const eventValue = utils_1.getValueOfExpression(context, eventNode, 'Literal');
    return typeof (eventValue === null || eventValue === void 0 ? void 0 : eventValue.value) === 'string' && eventValue.value.toLowerCase() === 'message';
}
class WindowNameVisitor {
    constructor() {
        this.hasWindowName = false;
    }
    static containsWindowName(node, context) {
        const visitor = new WindowNameVisitor();
        visitor.visit(node, context);
        return visitor.hasWindowName;
    }
    visit(root, context) {
        const visitNode = (node) => {
            if (node.type === 'Identifier' && node.name.match(/window/i)) {
                this.hasWindowName = true;
            }
            utils_1.childrenOf(node, context.getSourceCode().visitorKeys).forEach(visitNode);
        };
        visitNode(root);
    }
}
class EventListenerVisitor {
    constructor() {
        this.hasVerifiedOrigin = false;
    }
    static isSenderIdentityVerified(node, event, context) {
        const visitor = new EventListenerVisitor();
        visitor.visit(node, event, context);
        return visitor.hasVerifiedOrigin;
    }
    visit(root, event, context) {
        const visitNode = (node) => {
            var _a;
            if (this.hasVerifiedOrigin) {
                return;
            }
            const n = node;
            if (n.type === 'MemberExpression' && ((_a = n.parent) === null || _a === void 0 ? void 0 : _a.type) === 'BinaryExpression') {
                const { object, property } = n;
                if (object.type === 'Identifier' &&
                    object.name === event.name &&
                    property.type === 'Identifier' &&
                    property.name === 'origin') {
                    this.hasVerifiedOrigin = true;
                    return;
                }
            }
            utils_1.childrenOf(node, context.getSourceCode().visitorKeys).forEach(visitNode);
        };
        visitNode(root);
    }
}
//# sourceMappingURL=post-message.js.map