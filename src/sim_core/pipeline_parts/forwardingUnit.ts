/*
    Modul: forwardingUnit.ts
    Autor: Hůlek Matěj
*/

import * as R from "../register";
import * as P from "../pipeline"

export class ForwardingUnit {
    private pip: P.Pipeline

    constructor(pip: P.Pipeline) {
        this.pip = pip
    }

    run(): void {
        this.check(P.EPipelineMem.mem_wb)
        this.check(P.EPipelineMem.ex_mem)
    }

    private check(pipelineMem: P.EPipelineMem) {
        let id_ex = this.pip.getMem(P.EPipelineMem.id_ex)
        const mem = this.pip.getMem(pipelineMem);

        let forwardedVal0 = (id_ex.logs !== undefined && id_ex.logs.forwardedVal0 !== undefined) ? id_ex.logs.forwardedVal0 : 2
        if (id_ex.instruction.arg1 === mem.instruction.arg0 && id_ex.instruction.arg1 !== undefined && mem.res !== undefined
            && id_ex.instruction.arg1 !== R.ERegisters.$0) {
            id_ex.val0 = mem.res;
            forwardedVal0 = pipelineMem === P.EPipelineMem.ex_mem ? 1 : 0
        }
        let forwardedVal1 = (id_ex.logs !== undefined && id_ex.logs.forwardedVal1 !== undefined) ? id_ex.logs.forwardedVal1 : 2
        if (id_ex.instruction.arg2 === mem.instruction.arg0 && id_ex.instruction.arg2 !== undefined && mem.res !== undefined
            && id_ex.instruction.arg2 !== R.ERegisters.$0) {
            id_ex.val1 = mem.res;
            forwardedVal1 = pipelineMem === P.EPipelineMem.ex_mem ? 1 : 0
        }
        id_ex = this.log(id_ex, forwardedVal0, forwardedVal1)
        this.pip.setMem(P.EPipelineMem.id_ex, id_ex)
    }

    private log(ins: P.IPipelineIns, forwardedVal0: number, forwardedVal1: number): P.IPipelineIns {
        if (ins.logs === undefined) {
            ins.logs = {}
        }
        ins.logs.forwardedVal0 = forwardedVal0
        ins.logs.forwardedVal1 = forwardedVal1
        return ins
    }
}