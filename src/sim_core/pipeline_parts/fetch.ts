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

    constructor(pipeline: Pip.Pipeline, prg: Prg.Program) {
        this.program = prg
        this.pipeline = pipeline
    }

    setFlush() {
        this.flush = true
    }

    setStall() {
        this.stall = true;
    }

    runRisingEdge(): void {

        if (this.flush) {
            this.flush = false;
            this.data = { ...Pip.NOP, pc: this.data.pc }
            this.pipeline.setMem(Pip.EPipelineMem.if_id, this.data);
            return
        }
        if (this.stall) {
            this.stall = false
            return
        }

        this.data = this.program.getNextInstruction();
        this.pipeline.setMem(Pip.EPipelineMem.if_id, this.data);
        console.log("IF:", this.data);
    }

    getData(): Pip.IPipelineIns { return this.data }
}