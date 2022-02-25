import * as I from "./instruction";
import * as R from "./registr";
import * as M from "./memory";

class Program {
    private Instructions: I.IInstruction[];
    private PC: number = 0;
    constructor() {
        this.Instructions = [{ name: I.EInstructionName.add, arg0: R.ERegisters.$0, arg1: R.ERegisters.$1, arg2: R.ERegisters.$2 }]
    }
    getNextInstruction(): I.IInstruction { return this.Instructions[this.PC] }
}

export default Program;