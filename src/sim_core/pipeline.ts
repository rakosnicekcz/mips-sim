import * as I from "./instruction"
import * as R from "./registr";
import * as M from "./memory"
import * as P from "./program"
import * as IF from "./pipeline_parts/fetch"
import * as ID from "./pipeline_parts/decode"
import * as EX from "./pipeline_parts/execute"
import * as MEM from "./pipeline_parts/memory"
import * as WB from "./pipeline_parts/writeBack"
import deepcopy from 'deepcopy';


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
    instruction: { description: I.instruction_set.noop },
    pc: 0,
}

export class Pipeline {
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
        this.prg = new P.Program();

        this.if_stage = new IF.Fetch(this, this.prg)
        this.id_stage = new ID.Decode(this, this.reg);
        this.ex_stage = new EX.Execute(this)
        this.mem_stage = new MEM.Memory(this, this.mem);
        this.wb_stage = new WB.WriteBack(this, this.reg)

        this.reg.setVal(R.ERegisters.$11, 10)//smazat!!!
        this.reg.setVal(R.ERegisters.$12, 6)
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
        console.log("if_id:", this.if_id, "id_ex:", this.id_ex, "ex_mem:", this.ex_mem, "mem_wb:", this.mem_wb)
    }

    setMem(mem: EPipelineMem, value: IPipelineIns): void {
        switch (mem) {
            case EPipelineMem.if_id:
                this.if_id = deepcopy(value)
                break;
            case EPipelineMem.id_ex:
                this.id_ex = deepcopy(value)
                break;
            case EPipelineMem.ex_mem:
                this.ex_mem = deepcopy(value)
                break;
            case EPipelineMem.mem_wb:
                this.mem_wb = deepcopy(value)
                break;
        }
    }

    getMem(mem: EPipelineMem): IPipelineIns {
        switch (mem) {
            case EPipelineMem.if_id:
                return deepcopy(this.if_id)
            case EPipelineMem.id_ex:
                return deepcopy(this.id_ex)
            case EPipelineMem.ex_mem:
                return deepcopy(this.ex_mem)
            case EPipelineMem.mem_wb:
                return deepcopy(this.mem_wb)
        }
    }

}