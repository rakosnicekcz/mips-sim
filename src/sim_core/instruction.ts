import * as R from "./registr";
import * as P from "./pipeline";
import * as M from "./memory"

export enum EInstructionName {
    noop = "noop", add = "add", sub = "sub", lw = "lw"
}

export interface IInstructionDescription {
    name: EInstructionName;
    isJumpInstruction: boolean;
    isReadInstruction: boolean;
    writeBack: boolean;
    execute(ins: P.IPipelineIns): P.IPipelineIns;
    executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns;
}

export interface IInstruction {
    description: IInstructionDescription;
    arg0?: R.ERegisters;
    arg1?: R.ERegisters;
    arg2?: R.ERegisters;
    imm?: number | string
}

type TInstruction_set = Record<EInstructionName, IInstructionDescription>;

export const instruction_set: TInstruction_set = {
    [EInstructionName.add]: {
        name: EInstructionName.add, isJumpInstruction: false, isReadInstruction: false, writeBack: true,
        execute(ins: P.IPipelineIns): P.IPipelineIns {
            let array32 = new Int32Array(3);
            if (ins.val0 !== undefined && ins.val1 !== undefined) { // for TS to be happy
                array32[0] = ins.val0;
                array32[1] = ins.val1;
                array32[2] = array32[0] + array32[1];
            }
            ins.exRes = array32[2];
            return ins;
        },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins }
    },
    [EInstructionName.noop]: {
        name: EInstructionName.noop, isJumpInstruction: false, isReadInstruction: false, writeBack: false,
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins }
    },
    [EInstructionName.sub]: {
        name: EInstructionName.sub, isJumpInstruction: false, isReadInstruction: false, writeBack: false,
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns { return ins }
    },
    [EInstructionName.lw]: {
        name: EInstructionName.lw, isJumpInstruction: false, isReadInstruction: true, writeBack: false,
        execute(ins: P.IPipelineIns): P.IPipelineIns { return ins },
        executeMem(ins: P.IPipelineIns, mem: M.Memory): P.IPipelineIns {
            if (ins.val0) {
                ins.exRes = mem.load(M.EMemBitLenOperation.word, ins.val0)
            }
            return ins;
        }
    },
}