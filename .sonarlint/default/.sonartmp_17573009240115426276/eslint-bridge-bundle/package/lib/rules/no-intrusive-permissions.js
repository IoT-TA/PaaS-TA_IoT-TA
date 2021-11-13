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
// https://jira.sonarsource.com/browse/RSPEC-5604
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
const permissions = ['geolocation', 'camera', 'microphone', 'notifications', 'persistent-storage'];
exports.rule = {
    create(context) {
        return {
            'CallExpression[callee.type="MemberExpression"]'(node) {
                const call = node;
                const callee = call.callee;
                if (isNavigatorMemberExpression(callee, 'permissions', 'query') &&
                    call.arguments.length > 0) {
                    checkPermissions(context, call);
                    return;
                }
                if (context.options.includes('geolocation') &&
                    isNavigatorMemberExpression(callee, 'geolocation', 'watchPosition', 'getCurrentPosition')) {
                    context.report({
                        message: 'Make sure the use of the geolocation is necessary.',
                        node: callee,
                    });
                    return;
                }
                if (isNavigatorMemberExpression(callee, 'mediaDevices', 'getUserMedia') &&
                    call.arguments.length > 0) {
                    const firstArg = utils_1.getValueOfExpression(context, call.arguments[0], 'ObjectExpression');
                    checkForCameraAndMicrophonePermissions(context, callee, firstArg);
                    return;
                }
                if (context.options.includes('notifications') &&
                    utils_1.isMemberExpression(callee, 'Notification', 'requestPermission')) {
                    context.report({
                        message: 'Make sure the use of the notifications is necessary.',
                        node: callee,
                    });
                    return;
                }
                if (context.options.includes('persistent-storage') &&
                    utils_1.isMemberExpression(callee.object, 'navigator', 'storage')) {
                    context.report({
                        message: 'Make sure the use of the persistent-storage is necessary.',
                        node: callee,
                    });
                }
            },
            NewExpression(node) {
                const { callee } = node;
                if (context.options.includes('notifications') && utils_1.isIdentifier(callee, 'Notification')) {
                    context.report({
                        message: 'Make sure the use of the notifications is necessary.',
                        node: callee,
                    });
                }
            },
        };
    },
};
function checkForCameraAndMicrophonePermissions(context, callee, firstArg) {
    if (!firstArg) {
        return;
    }
    const shouldCheckAudio = context.options.includes('microphone');
    const shouldCheckVideo = context.options.includes('camera');
    if (!shouldCheckAudio && !shouldCheckVideo) {
        return;
    }
    const perms = [];
    for (const prop of firstArg.properties) {
        if (prop.type === 'Property') {
            const { value, key } = prop;
            if (utils_1.isIdentifier(key, 'audio') && shouldCheckAudio && isOtherThanFalse(context, value)) {
                perms.push('microphone');
            }
            else if (utils_1.isIdentifier(key, 'video') &&
                shouldCheckVideo &&
                isOtherThanFalse(context, value)) {
                perms.push('camera');
            }
        }
    }
    if (perms.length > 0) {
        context.report({
            message: `Make sure the use of the ${perms.join(' and ')} is necessary.`,
            node: callee,
        });
    }
}
function isOtherThanFalse(context, value) {
    const exprValue = utils_1.getValueOfExpression(context, value, 'Literal');
    if (exprValue && exprValue.value === false) {
        return false;
    }
    return true;
}
function checkPermissions(context, call) {
    const firstArg = utils_1.getValueOfExpression(context, call.arguments[0], 'ObjectExpression');
    if ((firstArg === null || firstArg === void 0 ? void 0 : firstArg.type) === 'ObjectExpression') {
        const nameProp = firstArg.properties.find(prop => hasNamePropertyWithPermission(prop, context));
        if (nameProp) {
            const { value } = nameProp.value;
            context.report({
                message: `Make sure the use of the ${value} is necessary.`,
                node: nameProp,
            });
        }
    }
}
function isNavigatorMemberExpression({ object, property }, firstProperty, ...secondProperty) {
    return (utils_1.isMemberExpression(object, 'navigator', firstProperty) &&
        utils_1.isIdentifier(property, ...secondProperty));
}
function hasNamePropertyWithPermission(prop, context) {
    if (prop.type === 'Property' && utils_1.isIdentifier(prop.key, 'name')) {
        const value = utils_1.getValueOfExpression(context, prop.value, 'Literal');
        return (value &&
            typeof value.value === 'string' &&
            permissions.includes(value.value) &&
            context.options.includes(value.value));
    }
    return false;
}
//# sourceMappingURL=no-intrusive-permissions.js.map