import * as I from "../instruction"
import * as R from "../registr";
import * as M from "../memory"
import * as Prg from "../program"
import * as Pip from "../pipeline"

export class Memory {
    private data: Pip.IPipelineIns;

    private pipeline: Pip.Pipeline
    private instruction: I.InstructionManager

    constructor(pipeline: Pip.Pipeline, instruction: I.InstructionManager) {
        this.pipeline = pipeline;
        this.instruction = instruction;
    }

    runRisingEdge() {
        this.data = this.pipeline.getMem(Pip.EPipelineMem.ex_mem);

        // TODO: cond jump

        this.data = this.instruction.executeMem(this.data)
        console.log("MEM:", this.data);
    }

    runFallingEdge() {
        this.pipeline.setMem(Pip.EPipelineMem.mem_wb, this.data);
    }
}