import * as I from "./instruction"
import * as R from "./registr";
import * as M from "./memory"
import * as P from "./program"
import * as IF from "./pipeline_stages/fetch"
import * as ID from "./pipeline_stages/decode"
import * as EX from "./pipeline_stages/execute"
import * as MEM from "./pipeline_stages/memory"
import * as WB from "./pipeline_stages/writeBack"

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

export const NOOP: IPipelineIns = {
    instruction: { name: I.EInstructionName.noop, isJumpInstruction: false, writeBack: false },
    pc: 0,
}

export class Pipeline {
    private ins: I.InstructionManager;
    private reg: R.Registers;
    private mem: M.Memory;
    private prg: P.Program;

    private if_id: IPipelineIns = NOOP;
    private id_ex: IPipelineIns = NOOP;
    private ex_mem: IPipelineIns = NOOP;
    private mem_wb: IPipelineIns = NOOP;

    private if_stage: IF.Fetch
    private id_stage: ID.Decode
    private ex_stage: EX.Execute
    private mem_stage: MEM.Memory
    private wb_stage: WB.WriteBack

    constructor() {
        this.reg = new R.Registers();
        this.mem = new M.Memory();
        this.ins = new I.InstructionManager(this.reg, this.mem);
        this.prg = new P.Program();

        this.if_stage = new IF.Fetch(this, this.prg)
        this.id_stage = new ID.Decode(this, this.reg);
        this.ex_stage = new EX.Execute(this, this.ins)
        this.mem_stage = new MEM.Memory(this, this.ins);
        this.wb_stage = new WB.WriteBack(this, this.reg)

        this.reg.setVal(R.ERegisters.$11, 10)//smazat!!!
    }

    run() {
        this.wb_stage.runRisingEdge();
        this.mem_stage.runRisingEdge();
        this.ex_stage.runRisingEdge();
        this.id_stage.runRisingEdge();
        this.if_stage.runRisingEdge();
        this.mem_stage.runFallingEdge();
        this.ex_stage.runFallingEdge();
        this.id_stage.runFallingEdge();
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