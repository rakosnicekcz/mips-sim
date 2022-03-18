import * as I from "../instruction"
import * as R from "../registr";
import * as M from "../memory"
import * as Prg from "../program"
import * as Pip from "../pipeline"

export class Memory {
    private data: Pip.IPipelineIns;

    private pipeline: Pip.Pipeline
    private memory: M.Memory

    constructor(pipeline: Pip.Pipeline, memory: M.Memory) {
        this.pipeline = pipeline;
        this.memory = memory;
    }

    runRisingEdge() {
        this.data = this.pipeline.getMem(Pip.EPipelineMem.ex_mem);

        // TODO: cond jump

        this.data = this.data.instruction.description.executeMem(this.data, this.memory);
        console.log("MEM:", this.data);
    }

    runFallingEdge() {
        this.pipeline.setMem(Pip.EPipelineMem.mem_wb, this.data);
    }
}