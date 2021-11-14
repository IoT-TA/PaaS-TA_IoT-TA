interface Context {
    workDir: string;
    shouldUseTypeScriptParserForJS: boolean;
    sonarlint: boolean;
}
export declare function getContext(): Context;
export declare function setContext(ctx: Context): void;
export {};
