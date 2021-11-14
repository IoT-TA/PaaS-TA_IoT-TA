import * as estree from 'estree';
import * as regexpp from 'regexpp';
import { CapturingGroup, Group, LookaroundAssertion, Pattern } from 'regexpp/ast';
import { AST, Rule } from 'eslint';
import { ParserServices } from '@typescript-eslint/experimental-utils';
/**
 * An alternation is a regexpp node that has an `alternatives` field.
 */
export declare type Alternation = Pattern | CapturingGroup | Group | LookaroundAssertion;
export declare function getParsedRegex(node: estree.Node, context: Rule.RuleContext): regexpp.AST.RegExpLiteral | null;
export declare function isRegExpConstructor(node: estree.Node): node is estree.CallExpression;
export declare function getFlags(callExpr: estree.CallExpression): string | null;
export declare function getRegexpLocation(node: estree.Node, regexpNode: regexpp.AST.Node, context: Rule.RuleContext, offset?: number[]): AST.SourceLocation;
export declare function getRegexpRange(node: estree.Node, regexpNode: regexpp.AST.Node): AST.Range;
export declare function isStringRegexMethodCall(call: estree.CallExpression, services: ParserServices): boolean;
