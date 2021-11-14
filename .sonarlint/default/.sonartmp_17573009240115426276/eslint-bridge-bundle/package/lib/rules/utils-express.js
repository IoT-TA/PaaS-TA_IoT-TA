"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Express = void 0;
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
const utils_1 = require("../utils");
/**
 * This modules provides utilities for writing rules about Express.js.
 */
var Express;
(function (Express) {
    const EXPRESS = 'express';
    /**
     * Checks whether the declaration looks somewhat like `<id> = express()`
     * and returns `<id>` if it matches.
     */
    function attemptFindAppInstantiation(varDecl, context) {
        var _a;
        const rhs = varDecl.init;
        if (rhs && rhs.type === 'CallExpression') {
            const { callee } = rhs;
            if (((_a = utils_1.getModuleNameOfNode(context, callee)) === null || _a === void 0 ? void 0 : _a.value) === EXPRESS) {
                const pattern = varDecl.id;
                return pattern.type === 'Identifier' ? pattern : undefined;
            }
        }
        return undefined;
    }
    Express.attemptFindAppInstantiation = attemptFindAppInstantiation;
    /**
     * Checks whether the function injects an instantiated app and is exported like `module.exports = function(app) {}`
     * or `module.exports.property = function(app) {}`, and returns app if it matches.
     */
    function attemptFindAppInjection(functionDef, context) {
        const app = functionDef.params.find(param => param.type === 'Identifier' && param.name === 'app');
        if (app) {
            const parent = utils_1.getParent(context);
            if ((parent === null || parent === void 0 ? void 0 : parent.type) === 'AssignmentExpression') {
                const { left } = parent;
                if (left.type === 'MemberExpression' &&
                    (utils_1.isModuleExports(left) || utils_1.isModuleExports(left.object))) {
                    return app;
                }
            }
        }
        return undefined;
    }
    Express.attemptFindAppInjection = attemptFindAppInjection;
    /**
     * Checks whether the expression looks somewhat like `app.use(m1, [m2, m3], ..., mN)`,
     * where one of `mK`-nodes satisfies the given predicate.
     */
    function isUsingMiddleware(context, callExpression, app, middlewareNodePredicate) {
        if (utils_1.isMethodInvocation(callExpression, app.name, 'use', 1)) {
            const flattenedArgs = utils_1.flattenArgs(context, callExpression.arguments);
            return Boolean(flattenedArgs.find(middlewareNodePredicate));
        }
        return false;
    }
    Express.isUsingMiddleware = isUsingMiddleware;
    /**
     * Checks whether a node looks somewhat like `require('m')()` for
     * some middleware `m` from the list of middlewares.
     */
    function isMiddlewareInstance(context, middlewares, n) {
        var _a;
        if (n.type === 'CallExpression') {
            const usedMiddleware = (_a = utils_1.getModuleNameOfNode(context, n.callee)) === null || _a === void 0 ? void 0 : _a.value;
            if (usedMiddleware) {
                return middlewares.includes(String(usedMiddleware));
            }
        }
        return false;
    }
    Express.isMiddlewareInstance = isMiddlewareInstance;
    /**
     * Rule factory for detecting sensitive settings that are passed to
     * middlewares eventually used by Express.js applications:
     *
     * app.use(
     *   middleware(settings)
     * )
     *
     * or
     *
     * app.use(
     *   middleware.method(settings)
     * )
     *
     * @param sensitivePropertyFinder - a function looking for a sensitive setting on a middleware call
     * @param message - the reported message when an issue is raised
     * @returns a rule module that raises issues when a sensitive property is found
     */
    function SensitiveMiddlewarePropertyRule(sensitivePropertyFinder, message) {
        return {
            meta: {
                schema: [
                    {
                        // internal parameter for rules having secondary locations
                        enum: ['sonar-runtime'],
                    },
                ],
            },
            create(context) {
                let app;
                let sensitiveProperties;
                function isExposing(middlewareNode) {
                    return Boolean(sensitiveProperties.push(...findSensitiveProperty(middlewareNode)));
                }
                function findSensitiveProperty(middlewareNode) {
                    if (middlewareNode.type === 'CallExpression') {
                        return sensitivePropertyFinder(context, middlewareNode);
                    }
                    return [];
                }
                return {
                    Program: () => {
                        app = null;
                        sensitiveProperties = [];
                    },
                    CallExpression: (node) => {
                        if (app) {
                            const callExpr = node;
                            const isSafe = !isUsingMiddleware(context, callExpr, app, isExposing);
                            if (!isSafe) {
                                for (const sensitive of sensitiveProperties) {
                                    context.report({
                                        node: callExpr,
                                        message: locations_1.toEncodedMessage(message, [sensitive]),
                                    });
                                }
                                sensitiveProperties = [];
                            }
                        }
                    },
                    VariableDeclarator: (node) => {
                        if (!app) {
                            const varDecl = node;
                            const instantiatedApp = attemptFindAppInstantiation(varDecl, context);
                            if (instantiatedApp) {
                                app = instantiatedApp;
                            }
                        }
                    },
                    ':function': (node) => {
                        if (!app) {
                            const functionDef = node;
                            const injectedApp = attemptFindAppInjection(functionDef, context);
                            if (injectedApp) {
                                app = injectedApp;
                            }
                        }
                    },
                };
            },
        };
    }
    Express.SensitiveMiddlewarePropertyRule = SensitiveMiddlewarePropertyRule;
})(Express = exports.Express || (exports.Express = {}));
//# sourceMappingURL=utils-express.js.map