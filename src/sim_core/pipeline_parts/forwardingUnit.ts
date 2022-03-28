import * as I from "../instruction";
import * as R from "../registr";
import * as M from "../memory";
import * as P from "../pipeline"

export class ForwardingUnit {
    private pip: P.Pipeline

    constructor(pip: P.Pipeline) {
        this.pip = pip
    }

    run(): void {
        this.check(P.EPipelineMem.ex_mem)
        this.check(P.EPipelineMem.mem_wb)
    }

    private check(pipelineMem: P.EPipelineMem) {
        let id_ex = this.pip.getMem(P.EPipelineMem.id_ex)
        const mem = this.pip.getMem(pipelineMem);

        if (id_ex.instruction.arg1 === mem.instruction.arg0) {
            id_ex.val0 = mem.res;
        } else if (id_ex.instruction.arg2 === mem.instruction.arg0) {
            id_ex.val1 = mem.res;
        }
        this.pip.setMem(P.EPipelineMem.id_ex, id_ex)
    }
}