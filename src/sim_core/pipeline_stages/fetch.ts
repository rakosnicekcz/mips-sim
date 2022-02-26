import * as I from "../instruction"
import * as R from "../registr";
import * as M from "../memory"
import * as Prg from "../program"
import * as Pip from "../pipeline"

export class Fetch {
    private program: Prg.Program

    private PC = 0;
    private stall = false;
    private flush = false;
    private data: Pip.IPipelineIns;
    private pipeline: Pip.Pipeline

    constructor(prg: Prg.Program, pipeline: Pip.Pipeline) {
        this.program = prg
        this.pipeline = pipeline
    }

    runRisingEdge(): void {

        //TODO: flush a stall

        this.data = this.program.getNextInstruction();
        this.pipeline.setMem(Pip.EPipelineMem.if_id, this.data);
    }
}