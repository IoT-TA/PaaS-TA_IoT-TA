"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const utils_1 = require("../utils");
exports.rule = {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: ['sonar-runtime'],
            },
        ],
    },
    create(context) {
        let jumpTargets = [];
        function enterScope() {
            jumpTargets.push(new JumpTarget());
        }
        function leaveScope() {
            jumpTargets.pop();
        }
        function increateNumberOfJumpsInScopes(jump, label) {
            for (const jumpTarget of [...jumpTargets].reverse()) {
                jumpTarget.jumps.push(jump);
                if (label === jumpTarget.label) {
                    break;
                }
            }
        }
        function leaveScopeAndCheckNumberOfJumps(node) {
            var _a;
            const jumps = (_a = jumpTargets.pop()) === null || _a === void 0 ? void 0 : _a.jumps;
            if (jumps && jumps.length > 1) {
                const sourceCode = context.getSourceCode();
                const firstToken = sourceCode.getFirstToken(node);
                context.report({
                    loc: firstToken.loc,
                    message: utils_1.toEncodedMessage('Reduce the total number of "break" and "continue" statements in this loop to use one at most.', jumps, jumps.map(jmp => jmp.type === 'BreakStatement' ? '"break" statement.' : '"continue" statement.')),
                });
            }
        }
        return {
            Program: () => {
                jumpTargets = [];
            },
            BreakStatement: (node) => {
                var _a;
                const breakStatement = node;
                increateNumberOfJumpsInScopes(breakStatement, (_a = breakStatement.label) === null || _a === void 0 ? void 0 : _a.name);
            },
            ContinueStatement: (node) => {
                var _a;
                const continueStatement = node;
                increateNumberOfJumpsInScopes(continueStatement, (_a = continueStatement.label) === null || _a === void 0 ? void 0 : _a.name);
            },
            SwitchStatement: enterScope,
            'SwitchStatement:exit': leaveScope,
            ForStatement: enterScope,
            'ForStatement:exit': leaveScopeAndCheckNumberOfJumps,
            ForInStatement: enterScope,
            'ForInStatement:exit': leaveScopeAndCheckNumberOfJumps,
            ForOfStatement: enterScope,
            'ForOfStatement:exit': leaveScopeAndCheckNumberOfJumps,
            WhileStatement: enterScope,
            'WhileStatement:exit': leaveScopeAndCheckNumberOfJumps,
            DoWhileStatement: enterScope,
            'DoWhileStatement:exit': leaveScopeAndCheckNumberOfJumps,
            LabeledStatement: (node) => {
                const labeledStatement = node;
                jumpTargets.push(new JumpTarget(labeledStatement.label.name));
            },
            'LabeledStatement:exit': leaveScope,
        };
    },
};
class JumpTarget {
    constructor(label) {
        this.jumps = [];
        this.label = label;
    }
}
//# sourceMappingURL=too-many-break-or-continue-in-loop.js.map