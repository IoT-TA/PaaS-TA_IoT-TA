import * as estree from 'estree';
import { ParserServices } from '@typescript-eslint/parser';
export interface GroupReference {
    raw: string;
    value: string;
}
export declare function isStringReplaceCall(call: estree.CallExpression, services: ParserServices): boolean;
export declare function extractReferences(node: estree.Node): GroupReference[];
