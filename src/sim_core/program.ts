import * as I from "./instruction";
import * as R from "./registr";
import * as M from "./memory";
import * as P from "./pipeline"

export class Program {
    private Instructions: I.IInstruction[];
    private PC: number = 0;
    constructor() {
        this.Instructions = [{
            description: I.instruction_set.add,
            arg0: R.ERegisters.$10, arg1: R.ERegisters.$11, arg2: R.ERegisters.$12
        }]
    }
    getNextInstruction(): P.IPipelineIns {
        if (this.PC >= this.Instructions.length) {
            return P.NOOP
        }
        return { instruction: this.Instructions[this.PC], pc: this.PC++ }
    }
}