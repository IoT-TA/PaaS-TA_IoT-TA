import * as estree from 'estree';
import { AST } from 'eslint';
import { TSESTree } from '@typescript-eslint/experimental-utils';
export declare type LocationHolder = AST.Token | TSESTree.Node | estree.Node | {
    loc: AST.SourceLocation;
};
export declare function toEncodedMessage(message: string, secondaryLocationsHolder: Array<LocationHolder>, secondaryMessages?: (string | undefined)[], cost?: number): string;
