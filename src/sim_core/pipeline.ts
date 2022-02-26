import * as I from "./instruction"
import * as R from "./registr";
import * as M from "./memory"
import * as P from "./program"
import * as IF from "./pipeline_stages/fetch"

export interface IPipelineIns {
    instruction: I.IInstruction;
    pc: number;
    val0?: number;
    val1?: number;
    exRes?: number;
}

export enum EPipelineMem {
    if_id,
    id_ex,
    ex_mem,
    mem_wb
}

export class Pipeline {
    private ins: I.InstructionManager;
    private reg: R.Registers;
    private mem: M.Memory;
    private prg: P.Program;

    private if_id: IPipelineIns;
    private id_ex: IPipelineIns;
    private ex_mem: IPipelineIns;
    private mem_wb: IPipelineIns;

    private if_stage: IF.Fetch

    constructor() {
        this.reg = new R.Registers();
        this.mem = new M.Memory();
        this.ins = new I.InstructionManager(this.reg, this.mem);
        this.prg = new P.Program();

        this.if_stage = new IF.Fetch(this.prg, this)
    }

    setMem(mem: EPipelineMem, value: IPipelineIns): void {
        switch (mem) {
            case EPipelineMem.if_id:
                this.if_id = value
                break;
            case EPipelineMem.id_ex:
                this.id_ex = value
                break;
            case EPipelineMem.ex_mem:
                this.ex_mem = value
                break;
            case EPipelineMem.mem_wb:
                this.mem_wb = value
                break;
        }
    }

    getMem(mem: EPipelineMem): IPipelineIns {
        switch (mem) {
            case EPipelineMem.if_id:
                return this.if_id
            case EPipelineMem.id_ex:
                return this.id_ex
            case EPipelineMem.ex_mem:
                return this.ex_mem
            case EPipelineMem.mem_wb:
                return this.mem_wb
        }
    }

}