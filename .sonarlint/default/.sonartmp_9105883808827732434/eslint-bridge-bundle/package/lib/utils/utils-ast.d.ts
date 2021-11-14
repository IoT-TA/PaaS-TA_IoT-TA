import { TSESTree } from '@typescript-eslint/experimental-utils';
import { Rule, Scope } from 'eslint';
import * as estree from 'estree';
export declare type LoopLike = estree.WhileStatement | estree.DoWhileStatement | estree.ForStatement | estree.ForOfStatement | estree.ForInStatement;
export declare type FunctionNodeType = estree.FunctionDeclaration | estree.FunctionExpression | estree.ArrowFunctionExpression;
export declare const FUNCTION_NODES: string[];
export declare const functionLike: Set<string>;
export declare function isIdentifier(node: estree.Node, ...values: string[]): node is estree.Identifier;
export declare function isMemberWithProperty(node: estree.Node, ...values: string[]): boolean;
export declare function isMemberExpression(node: estree.Node, objectValue: string, ...propertyValue: string[]): boolean;
export declare function isBinaryPlus(node: estree.Node): node is estree.BinaryExpression & {
    operator: '+';
};
export declare function isUnaryExpression(node: estree.Node | undefined): node is estree.UnaryExpression;
export declare function isArrayExpression(node: estree.Node | undefined): node is estree.ArrayExpression;
export declare function isRequireModule(node: estree.CallExpression, ...moduleNames: string[]): boolean;
export declare function isMethodInvocation(callExpression: estree.CallExpression, objectIdentifierName: string, methodName: string, minArgs: number): boolean;
export declare function isMethodCall(callExpr: estree.CallExpression): callExpr is estree.CallExpression & {
    callee: estree.MemberExpression & {
        property: estree.Identifier;
    };
};
export declare function isCallingMethod(callExpr: estree.CallExpression, arity: number, ...methodNames: string[]): callExpr is estree.CallExpression & {
    callee: estree.MemberExpression & {
        property: estree.Identifier;
    };
};
export declare function isNamespaceSpecifier(importDeclaration: estree.ImportDeclaration, name: string): boolean;
export declare function isDefaultSpecifier(importDeclaration: estree.ImportDeclaration, name: string): boolean;
export declare function isModuleExports(node: estree.Node): boolean;
export declare function isFunctionNode(node: estree.Node): node is FunctionNodeType;
export declare function isLiteral(n: estree.Node | null): n is estree.Literal;
export declare function isNullLiteral(n: estree.Node): boolean;
/**
 * Detect expression statements like the following:
 *  myArray[1] = 42;
 *  myArray[1] += 42;
 *  myObj.prop1 = 3;
 *  myObj.prop1 += 3;
 */
export declare function isElementWrite(statement: estree.ExpressionStatement, ref: Scope.Reference): boolean;
export declare function isReferenceTo(ref: Scope.Reference, node: estree.Node): boolean;
export declare function getUniqueWriteUsage(context: Rule.RuleContext, name: string): estree.Program | estree.ExpressionStatement | estree.BlockStatement | estree.EmptyStatement | estree.DebuggerStatement | estree.WithStatement | estree.ReturnStatement | estree.LabeledStatement | estree.BreakStatement | estree.ContinueStatement | estree.IfStatement | estree.SwitchStatement | estree.ThrowStatement | estree.TryStatement | estree.WhileStatement | estree.DoWhileStatement | estree.ForStatement | estree.ForInStatement | estree.ForOfStatement | estree.FunctionDeclaration | estree.VariableDeclaration | estree.ClassDeclaration | estree.ImportDeclaration | estree.ExportNamedDeclaration | estree.ExportDefaultDeclaration | estree.ExportAllDeclaration | estree.ThisExpression | estree.ArrayExpression | estree.ObjectExpression | estree.FunctionExpression | estree.ArrowFunctionExpression | estree.YieldExpression | estree.SimpleLiteral | estree.RegExpLiteral | estree.BigIntLiteral | estree.UnaryExpression | estree.UpdateExpression | estree.BinaryExpression | estree.AssignmentExpression | estree.LogicalExpression | estree.MemberExpression | estree.ConditionalExpression | estree.SimpleCallExpression | estree.NewExpression | estree.SequenceExpression | estree.TemplateLiteral | estree.TaggedTemplateExpression | estree.ClassExpression | estree.MetaProperty | estree.Identifier | estree.AwaitExpression | estree.ImportExpression | estree.ChainExpression | estree.SwitchCase | estree.CatchClause | estree.VariableDeclarator | estree.PrivateIdentifier | estree.Property | estree.PropertyDefinition | estree.Super | estree.TemplateElement | estree.SpreadElement | estree.ObjectPattern | estree.ArrayPattern | estree.RestElement | estree.AssignmentPattern | estree.ClassBody | estree.MethodDefinition | estree.ImportSpecifier | estree.ImportDefaultSpecifier | estree.ImportNamespaceSpecifier | estree.ExportSpecifier | undefined;
export declare function getUniqueWriteUsageOrNode(context: Rule.RuleContext, node: estree.Node): estree.Node;
export declare function getValueOfExpression<T extends estree.Node['type']>(context: Rule.RuleContext, expr: estree.Node | undefined | null, type: T): Extract<estree.Program, {
    type: T;
}> | Extract<estree.ExpressionStatement, {
    type: T;
}> | Extract<estree.BlockStatement, {
    type: T;
}> | Extract<estree.EmptyStatement, {
    type: T;
}> | Extract<estree.DebuggerStatement, {
    type: T;
}> | Extract<estree.WithStatement, {
    type: T;
}> | Extract<estree.ReturnStatement, {
    type: T;
}> | Extract<estree.LabeledStatement, {
    type: T;
}> | Extract<estree.BreakStatement, {
    type: T;
}> | Extract<estree.ContinueStatement, {
    type: T;
}> | Extract<estree.IfStatement, {
    type: T;
}> | Extract<estree.SwitchStatement, {
    type: T;
}> | Extract<estree.ThrowStatement, {
    type: T;
}> | Extract<estree.TryStatement, {
    type: T;
}> | Extract<estree.WhileStatement, {
    type: T;
}> | Extract<estree.DoWhileStatement, {
    type: T;
}> | Extract<estree.ForStatement, {
    type: T;
}> | Extract<estree.ForInStatement, {
    type: T;
}> | Extract<estree.ForOfStatement, {
    type: T;
}> | Extract<estree.FunctionDeclaration, {
    type: T;
}> | Extract<estree.VariableDeclaration, {
    type: T;
}> | Extract<estree.ClassDeclaration, {
    type: T;
}> | Extract<estree.ImportDeclaration, {
    type: T;
}> | Extract<estree.ExportNamedDeclaration, {
    type: T;
}> | Extract<estree.ExportDefaultDeclaration, {
    type: T;
}> | Extract<estree.ExportAllDeclaration, {
    type: T;
}> | Extract<estree.ThisExpression, {
    type: T;
}> | Extract<estree.ArrayExpression, {
    type: T;
}> | Extract<estree.ObjectExpression, {
    type: T;
}> | Extract<estree.FunctionExpression, {
    type: T;
}> | Extract<estree.ArrowFunctionExpression, {
    type: T;
}> | Extract<estree.YieldExpression, {
    type: T;
}> | Extract<estree.SimpleLiteral, {
    type: T;
}> | Extract<estree.RegExpLiteral, {
    type: T;
}> | Extract<estree.BigIntLiteral, {
    type: T;
}> | Extract<estree.UnaryExpression, {
    type: T;
}> | Extract<estree.UpdateExpression, {
    type: T;
}> | Extract<estree.BinaryExpression, {
    type: T;
}> | Extract<estree.AssignmentExpression, {
    type: T;
}> | Extract<estree.LogicalExpression, {
    type: T;
}> | Extract<estree.MemberExpression, {
    type: T;
}> | Extract<estree.ConditionalExpression, {
    type: T;
}> | Extract<estree.SimpleCallExpression, {
    type: T;
}> | Extract<estree.NewExpression, {
    type: T;
}> | Extract<estree.SequenceExpression, {
    type: T;
}> | Extract<estree.TemplateLiteral, {
    type: T;
}> | Extract<estree.TaggedTemplateExpression, {
    type: T;
}> | Extract<estree.ClassExpression, {
    type: T;
}> | Extract<estree.MetaProperty, {
    type: T;
}> | Extract<estree.Identifier, {
    type: T;
}> | Extract<estree.AwaitExpression, {
    type: T;
}> | Extract<estree.ImportExpression, {
    type: T;
}> | Extract<estree.ChainExpression, {
    type: T;
}> | Extract<estree.SwitchCase, {
    type: T;
}> | Extract<estree.CatchClause, {
    type: T;
}> | Extract<estree.VariableDeclarator, {
    type: T;
}> | Extract<estree.PrivateIdentifier, {
    type: T;
}> | Extract<estree.Property, {
    type: T;
}> | Extract<estree.PropertyDefinition, {
    type: T;
}> | Extract<estree.Super, {
    type: T;
}> | Extract<estree.TemplateElement, {
    type: T;
}> | Extract<estree.SpreadElement, {
    type: T;
}> | Extract<estree.ObjectPattern, {
    type: T;
}> | Extract<estree.ArrayPattern, {
    type: T;
}> | Extract<estree.RestElement, {
    type: T;
}> | Extract<estree.AssignmentPattern, {
    type: T;
}> | Extract<estree.ClassBody, {
    type: T;
}> | Extract<estree.MethodDefinition, {
    type: T;
}> | Extract<estree.ImportSpecifier, {
    type: T;
}> | Extract<estree.ImportDefaultSpecifier, {
    type: T;
}> | Extract<estree.ImportNamespaceSpecifier, {
    type: T;
}> | Extract<estree.ExportSpecifier, {
    type: T;
}> | undefined;
/**
 * for `x = 42` or `let x = 42` when visiting '42' returns 'x' variable
 */
export declare function getLhsVariable(context: Rule.RuleContext): Scope.Variable | undefined;
export declare function getVariableFromName(context: Rule.RuleContext, name: string): Scope.Variable | undefined;
/**
 * Takes array of arguments. Keeps following variable definitions
 * and unpacking arrays as long as possible. Returns flattened
 * array with all collected nodes.
 *
 * A usage example should clarify why this might be useful.
 * According to ExpressJs `app.use` spec, the arguments can be:
 *
 * - A middleware function.
 * - A series of middleware functions (separated by commas).
 * - An array of middleware functions.
 * - A combination of all of the above.
 *
 * This means that methods like `app.use` accept variable arguments,
 * but also arrays, or combinations thereof. This methods helps
 * to flatten out such complicated composed argument lists.
 */
export declare function flattenArgs(context: Rule.RuleContext, args: estree.Node[]): estree.Node[];
export declare function resolveIdentifiers(node: TSESTree.Node, acceptShorthand?: boolean): TSESTree.Identifier[];
export declare function getObjectExpressionProperty(node: estree.Node | undefined | null, propertyKey: string): estree.Property | undefined;
export declare function getPropertyWithValue(context: Rule.RuleContext, objectExpression: estree.ObjectExpression, propertyName: string, propertyValue: estree.Literal['value']): estree.Property | undefined;
export declare function resolveFromFunctionReference(context: Rule.RuleContext, functionIdentifier: estree.Identifier): estree.FunctionDeclaration | estree.FunctionExpression | null;
export declare function resolveFunction(context: Rule.RuleContext, node: estree.Node): estree.Function | null;
export declare function checkSensitiveCall(context: Rule.RuleContext, callExpression: estree.CallExpression, sensitiveArgumentIndex: number, sensitiveProperty: string, sensitivePropertyValue: boolean, message: string): void;
export declare function isStringLiteral(node: estree.Node): node is estree.Literal;
export declare function isRegexLiteral(node: estree.Node): node is estree.RegExpLiteral;
export declare function isDotNotation(node: estree.Node): node is estree.MemberExpression & {
    property: estree.Identifier;
};
export declare function isObjectDestructuring(node: estree.Node): node is (estree.VariableDeclarator & {
    id: estree.ObjectPattern;
}) | (estree.AssignmentExpression & {
    left: estree.ObjectPattern;
});
export declare function isStaticTemplateLiteral(node: estree.Node): node is estree.TemplateLiteral;
