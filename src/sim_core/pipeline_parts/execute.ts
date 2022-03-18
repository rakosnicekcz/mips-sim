import * as I from "../instruction"
import * as R from "../registr";
import * as M from "../memory"
import * as Prg from "../program"
import * as Pip from "../pipeline"

export class Execute {
    private flush = false;
    private data: Pip.IPipelineIns;

    private pipeline: Pip.Pipeline

    constructor(pipeline: Pip.Pipeline) {
        this.pipeline = pipeline;
    }

    setFlush() {
        this.flush = true;
    }

    runRisingEdge() {

        if (this.flush) {
            this.flush = false;
            this.data = Pip.NOOP;
            return;
        }

        this.data = this.pipeline.getMem(Pip.EPipelineMem.id_ex);
        this.data = this.data.instruction.description.execute(this.data)
        console.log("EX:", this.data);
    }

    runFallingEdge() {
        this.pipeline.setMem(Pip.EPipelineMem.ex_mem, this.data);
    }
}