import * as R from "./registr";
import * as P from "./pipeline";
import * as M from "./memory"

export enum EInstructionName {
    noop = "noop", add = "add", sub = "sub", lw = "lw"
}

export interface IInstruction {
    name: EInstructionName;
    isJumpInstruction: boolean;
    writeBack: boolean;
    arg0?: R.ERegisters;
    arg1?: R.ERegisters;
    arg2?: R.ERegisters;
    imm?: number | string
}

export class InstructionManager {
    private reg: R.Registers;
    private mem: M.Memory;
    constructor(reg: R.Registers, mem: M.Memory) {
        this.reg = reg;
        this.mem = mem;
    }

    execute(ins: P.IPipelineIns): P.IPipelineIns {
        switch (ins.instruction.name) {
            case EInstructionName.add:
                return this.executeADD(ins);
            case EInstructionName.sub:
                return this.executeADD(ins);
        }
        return ins
    }

    executeMem(ins: P.IPipelineIns): P.IPipelineIns {
        switch (ins.instruction.name) {
            case EInstructionName.lw:
                return this.executeLW(ins);
        }
        return ins
    }

    private executeADD(ins: P.IPipelineIns): P.IPipelineIns {
        let array32 = new Int32Array(3);
        if (ins.val0 !== undefined && ins.val1 !== undefined) { // for TS to be happy
            array32[0] = ins.val0;
            array32[1] = ins.val1;
            array32[2] = array32[0] + array32[1];
        }
        ins.exRes = array32[2];
        return ins;
    }

    private executeLW(ins: P.IPipelineIns): P.IPipelineIns {
        if (ins.val0) {
            ins.exRes = this.mem.load(M.EMemBitLenOperation.word, ins.val0)
        }
        return ins;
    }
}