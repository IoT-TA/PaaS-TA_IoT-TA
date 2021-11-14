"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCallToFQN = exports.getModuleNameFromRequire = exports.getRequireCalls = exports.getImportDeclarations = exports.getModuleNameOfImportedIdentifier = exports.getModuleNameOfNode = exports.getModuleNameOfIdentifier = void 0;
const utils_ast_1 = require("./utils-ast");
/**
 * Returns the module name, when an identifier either represents a namespace for that module,
 * or is an alias for the default exported value.
 *
 * Returns undefined otherwise.
 * example: Given `import * as X from 'module_name'`, `getModuleNameOfIdentifier(X)`
 * returns `module_name`.
 */
function getModuleNameOfIdentifier(context, identifier) {
    const { name } = identifier;
    // check if importing using `import * as X from 'module_name'`
    const importDeclaration = getImportDeclarations(context).find(importDecl => utils_ast_1.isNamespaceSpecifier(importDecl, name) || utils_ast_1.isDefaultSpecifier(importDecl, name));
    if (importDeclaration) {
        return importDeclaration.source;
    }
    // check if importing using `const X = require('module_name')`
    const writeExpression = utils_ast_1.getUniqueWriteUsage(context, name);
    if (writeExpression) {
        return getModuleNameFromRequire(writeExpression);
    }
    return undefined;
}
exports.getModuleNameOfIdentifier = getModuleNameOfIdentifier;
/**
 * Returns the module name of either a directly `require`d or referenced module in
 * the following cases:
 *
 *  1. If `node` is a `require('m')` call;
 *  2. If `node` is an identifier `i` bound by an import, as in `import i from 'm'`;
 *  3. If `node` is an identifier `i`, and there is a single assignment with a `require`
 *     on the right hand side, i.e. `var i = require('m')`;
 *
 * then, in all three cases, the returned value will be the name of the module `'m'`.
 *
 * @param node the expression that is expected to evaluate to a module
 * @param context the rule context
 * @return literal with the name of the module or `undefined`.
 */
function getModuleNameOfNode(context, node) {
    if (node.type === 'Identifier') {
        return getModuleNameOfIdentifier(context, node);
    }
    else {
        return getModuleNameFromRequire(node);
    }
}
exports.getModuleNameOfNode = getModuleNameOfNode;
/**
 * Returns the module name, when an identifier represents a binding imported from another module.
 * Returns undefined otherwise.
 * example: Given `import { f } from 'module_name'`, `getModuleNameOfImportedIdentifier(f)` returns `module_name`
 */
function getModuleNameOfImportedIdentifier(context, identifier) {
    // check if importing using `import { f } from 'module_name'`
    const importedDeclaration = getImportDeclarations(context).find(({ specifiers }) => specifiers.some(spec => spec.type === 'ImportSpecifier' && spec.imported.name === identifier.name));
    if (importedDeclaration) {
        return importedDeclaration.source;
    }
    // check if importing using `const f = require('module_name').f`
    const writeExpression = utils_ast_1.getUniqueWriteUsage(context, identifier.name);
    if (writeExpression &&
        writeExpression.type === 'MemberExpression' &&
        utils_ast_1.isIdentifier(writeExpression.property, identifier.name)) {
        return getModuleNameFromRequire(writeExpression.object);
    }
    return undefined;
}
exports.getModuleNameOfImportedIdentifier = getModuleNameOfImportedIdentifier;
function getImportDeclarations(context) {
    const program = context.getAncestors().find(node => node.type === 'Program');
    if (program.sourceType === 'module') {
        return program.body.filter(node => node.type === 'ImportDeclaration');
    }
    return [];
}
exports.getImportDeclarations = getImportDeclarations;
function getRequireCalls(context) {
    const required = [];
    const variables = context.getScope().variables;
    variables.forEach(variable => variable.defs.forEach(def => {
        var _a;
        if (def.type === 'Variable' &&
            ((_a = def.node.init) === null || _a === void 0 ? void 0 : _a.type) === 'CallExpression' &&
            def.node.init.callee.type === 'Identifier' &&
            def.node.init.callee.name === 'require' &&
            def.node.init.arguments.length === 1) {
            required.push(def.node.init);
        }
    }));
    return required;
}
exports.getRequireCalls = getRequireCalls;
function getModuleNameFromRequire(node) {
    if (node.type === 'CallExpression' &&
        utils_ast_1.isIdentifier(node.callee, 'require') &&
        node.arguments.length === 1) {
        const moduleName = node.arguments[0];
        if (moduleName.type === 'Literal') {
            return moduleName;
        }
    }
    return undefined;
}
exports.getModuleNameFromRequire = getModuleNameFromRequire;
function isCallToFQN(context, callExpression, moduleName, functionName) {
    const { callee } = callExpression;
    if (callee.type !== 'MemberExpression') {
        return false;
    }
    const module = getModuleNameOfNode(context, callee.object);
    return (module === null || module === void 0 ? void 0 : module.value) === moduleName && utils_ast_1.isIdentifier(callee.property, functionName);
}
exports.isCallToFQN = isCallToFQN;
//# sourceMappingURL=utils-module.js.map