import * as I from "./instruction";
import * as R from "./registr";
import * as M from "./memory";
import * as P from "./pipeline"

export class Program {
    private Instructions: I.IInstruction[];
    private PC: number = 0;
    constructor() {
        this.Instructions = [{ name: I.EInstructionName.add, isJumpInstruction: false, arg0: R.ERegisters.$0, arg1: R.ERegisters.$1, arg2: R.ERegisters.$2 }]
        let a = new R.Registers();
        a.printAllRegisters();
    }
    getNextInstruction(): P.IPipelineIns {
        return { instruction: this.Instructions[this.PC], pc: this.PC++ }
    }
}