import { SourceCode } from 'eslint';
import { AST } from 'vue-eslint-parser';
export declare function extractTokensAndComments(sourceCode: SourceCode): {
    tokens: AST.Token[];
    comments: AST.Token[];
};
