import * as I from "../instruction"
import * as R from "../registr";
import * as M from "../memory"
import * as Prg from "../program"
import * as Pip from "../pipeline"

export class Execute {
    private flush = false;
    private data: Pip.IPipelineIns;

    private pipeline: Pip.Pipeline
    private instruction: I.InstructionManager

    constructor(pipeline: Pip.Pipeline, instruction: I.InstructionManager) {
        this.pipeline = pipeline;
        this.instruction = instruction;
    }

    runRisingEdge() {

        //todo stall a flush

        this.data = this.pipeline.getMem(Pip.EPipelineMem.id_ex);
        this.data = this.instruction.execute(this.data);
    }

    runFallingEdge() {
        this.pipeline.setMem(Pip.EPipelineMem.ex_mem, this.data);
    }
}