import * as R from "./registr";

export enum EInstructionName {
    add, sub
}

export interface IInstruction {
    name: EInstructionName;
    arg0?: R.ERegisters;
    arg1?: R.ERegisters;
    arg2?: R.ERegisters;
    imm?: number | string
}

export class InstructionManager {
    private reg: R.Registers;
    constructor(reg: R.Registers) {
        this.reg = reg;
    }

    execute(ins: IInstruction) {
        switch (ins.name) {
            case EInstructionName.add:
                if (ins.arg0 && ins.arg1 && ins.arg2) {
                    this.reg.setVal(ins.arg0, this.reg.getVal(ins.arg1) + this.reg.getVal(ins.arg2));
                } else {
                    throw new Error("instruction ADD: undefined argument")
                }
                break;
            case EInstructionName.sub:
                if (ins.arg0 && ins.arg1 && ins.arg2) {
                    this.reg.setVal(ins.arg0, this.reg.getVal(ins.arg1) - this.reg.getVal(ins.arg2));
                } else {
                    throw new Error("instruction SUB: undefined argument")
                }
                break;
        }
    }
}