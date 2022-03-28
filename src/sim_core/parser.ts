import * as I from "./instruction"
import * as R from "./registr"
import * as M from "./memory"
import * as P from "./program"

enum ParsingArea {
    text,
    data
}

export class Parser {
    private parsingArea: ParsingArea = ParsingArea.text
    private globl: string
    private labels: P.Ilabel[] = [];
    private Instructions: I.IInstruction[] = [];
    private staticData: M.IMemStaticData[] = [];
    private staticDataAdd: number = 0;

    parse(code: string) {
        console.log(code)
        let codeLines = code.split("\n").map((e) => { return e.split(/#(?![^"]*")/g)[0].trim() });
        for (let i = 0; i < codeLines.length; i++) {
            let lineParts = this.getLineParts(codeLines[i])
            console.log(lineParts);

            if (lineParts.length === 0) {
                continue;
            } else if (lineParts[0] === ".text" && lineParts.length === 1) {
                this.parsingArea = ParsingArea.text
            } else if (lineParts[0] === ".data" && lineParts.length === 1) {
                this.parsingArea = ParsingArea.data
            } else if (lineParts[0] === ".globl" && lineParts.length === 2) {
                if (this.globl) {
                    throw new Error(".globl can be set only once");
                }
                this.globl = lineParts[1];
            } else {
                this.parseData(lineParts, i);
            }
        }

        for (let i = 0; i < codeLines.length; i++) {
            let lineParts = this.getLineParts(codeLines[i])
            console.log(lineParts);

            if (lineParts.length === 0) {
                continue;
            } else if (lineParts[0] === ".text" && lineParts.length === 1) {
                this.parsingArea = ParsingArea.text
            } else if (lineParts[0] === ".data" && lineParts.length === 1) {
                this.parsingArea = ParsingArea.data
            } else if (lineParts[0] === ".globl" && lineParts.length === 2) {
                if (this.globl) {
                    throw new Error(".globl can be set only once");
                }
                this.globl = lineParts[1];
            } else {
                this.parseText(lineParts, i);
            }
        }

        //console.log(this.Instructions, this.labels, this.staticData)
    }

    getInstructions(): I.IInstruction[] {
        return this.Instructions
    }

    getLabels() {
        return this.labels
    }

    private getLineParts(line: string): string[] {
        let lineParts = line.split(" ");
        lineParts = lineParts.filter(e => { return e !== "" && e !== "," })
        return lineParts.map(e => { return e.trim().replace(/^,+|,+$/g, '') })
    }

    private parseData(lineParts: string[], i: number) {
        if (this.parsingArea !== ParsingArea.data) {
            if (lineParts[0].endsWith(":")) {
                if (Object.values(I.EInstructionName).includes(lineParts[0].slice(0, -1) as unknown as I.EInstructionName)) {
                    throw new Error("Label cant have same name as instruction");
                }
                this.labels.push({ line: i, name: lineParts[0].slice(0, -1) })
            }
            return;
        }

        let con: M.IMemStaticData = { address: this.staticDataAdd, name: "", type: M.EMemStaticOperations.byte, value: new Int8Array(1) }
        if (/^[a-zA-Z][a-zA-Z0-9]*:$/.test(lineParts[0])) {
            con.name = lineParts[0].slice(0, -1);
        } else {
            throw new Error("Wrong name of static value");
        }

        let directiveId = Object.keys(M.EMemStaticOperations).indexOf(lineParts[1].substring(1))
        if (directiveId === -1) {
            throw new Error("Wrong Directive");
        } else {
            con.type = Object.values(M.EMemStaticOperations)[directiveId]
        }

        if (con.type === M.EMemStaticOperations.space) {
            if (isNaN(Number(lineParts[2])) || lineParts.length !== 3) {
                throw new Error("Wrong Space definition");
            } else {
                con.value = new Int8Array(Number(lineParts[2]))
            }
        } else if (con.type === M.EMemStaticOperations.ascii || con.type === M.EMemStaticOperations.asciiz) {
            if (lineParts.length !== 3 || !/^".*"$/.test(lineParts[2])) {
                throw new Error("Wrong ascii/z definition");
            }
            let enc = new TextEncoder();
            if (con.type === M.EMemStaticOperations.asciiz) {
                con.value = new Int8Array([...enc.encode(lineParts[2].slice(1, -1)), 0x00])
            } else {
                con.value = new Int8Array([...enc.encode(lineParts[2].slice(1, -1))]);
            }
        } else {
            let vals = lineParts.slice(2).map(Number);
            if (vals.filter(e => isNaN(e)).length > 0) {
                throw new Error("Wrong elements in array");
            }
            if (con.type === M.EMemStaticOperations.byte) {
                con.value = new Int8Array(vals)
            } else if (con.type === M.EMemStaticOperations.half) {
                con.value = new Int8Array(new Int16Array(vals).buffer)
            } else {
                con.value = new Int8Array(new Int32Array(vals).buffer)
            }
        }
        this.staticDataAdd += con.value.byteLength
        console.log(con)
        this.staticData.push(con)
    }

    private parseText(lineParts: string[], i: number) {
        if (this.parsingArea !== ParsingArea.text) {
            return;
        }

        if (lineParts[0].endsWith(":")) {
            if (Object.values(I.EInstructionName).includes(lineParts[0].slice(0, -1) as unknown as I.EInstructionName)) {
                throw new Error("Label cant have same name as instruction");
            }
            this.labels.push({ line: i, name: lineParts[0].slice(0, -1) })
            lineParts.shift()
        }

        if (Object.values(I.EInstructionName).includes(lineParts[0] as unknown as I.EInstructionName)) {
            let insName = I.EInstructionName[lineParts[0] as keyof typeof I.EInstructionName]
            let ins: I.IInstruction = { description: I.instruction_set[insName], line: i, paramType: [] };
            this.findit(insName, ins, lineParts);
            if (ins.description.isMemoryInstruction) {
                // TODO MEMORY INS
                if (lineParts[2].substring(0, 3) === "0x") {

                }
            } else if (I.instruction_set[insName].paramTypes.length + 1 === lineParts.length) {
                for (let i = 0; i < I.instruction_set[insName].paramTypes.length; i++) {
                    const type = I.instruction_set[insName].paramTypes[0][i]; // TU pozor!!! Nema byt nultý
                    const param = lineParts[i + 1];
                    if (type === I.EInstructionParamType.adress || type === I.EInstructionParamType.immidiate) {
                        if (isNaN(Number(param))) {
                            throw new Error("Not a Number");
                        } else {
                            ins.imm = param
                        }
                    } else if (type === I.EInstructionParamType.labelT) {
                        if (this.labels.some(e => e.name === param)) {
                            ins.imm = param
                        }
                    } else if (type === I.EInstructionParamType.labelD) {
                        if (this.staticData.some(e => e.name === param)) {
                            ins.imm = param
                        }
                    } else if (Object.values(R.ERegisters).includes(param as unknown as R.ERegisters)) {
                        const regId = Object.values(R.ERegisters).indexOf(param as unknown as R.ERegisters);
                        let reg = Object.values(R.ERegisters)[regId]
                        if (!ins.arg0) {
                            ins.arg0 = reg
                        } else if (!ins.arg1) {
                            ins.arg1 = reg
                        } else {
                            ins.arg2 = reg
                        }
                    } else {
                        throw new Error("Wrong Instruction format");
                    }
                }
            }
            this.Instructions.push(ins)
        } else {
            throw new Error("Instruction do not exist;");
        }
    }

    private findit(insName: I.EInstructionName, ins: I.IInstruction, lineParts: string[]): I.IInstruction {
        paramTypeLoop:
        for (const paramType of I.instruction_set[insName].paramTypes) {
            if (lineParts.length !== paramType.length + 1) {
                continue;
            }

            for (let i = 0; i < paramType.length; i++) {
                const type = paramType[i];
                const param = lineParts[i + 1];

                if (type === I.EInstructionParamType.adress || type === I.EInstructionParamType.immidiate) {
                    if (isNaN(Number(param))) {
                        continue paramTypeLoop;
                    } else {
                        ins.imm = Number(param)
                    }
                } else if (type === I.EInstructionParamType.labelT) {
                    if (this.labels.some(e => e.name === param)) {
                        ins.imm = param
                    } else {
                        continue paramTypeLoop;
                    }
                } else if (type === I.EInstructionParamType.labelD) {
                    if (this.staticData.some(e => e.name === param)) {
                        ins.imm = param
                    } else {
                        continue paramTypeLoop;
                    }
                } else if (Object.values(R.ERegisters).includes(param as unknown as R.ERegisters)) {
                    const regId = Object.values(R.ERegisters).indexOf(param as unknown as R.ERegisters);
                    let reg = Object.values(R.ERegisters)[regId]
                    if (!ins.arg0) {
                        ins.arg0 = reg
                    } else if (!ins.arg1) {
                        ins.arg1 = reg
                    } else {
                        ins.arg2 = reg
                    }
                } else {
                    continue paramTypeLoop;
                }
            }
            return ins;
        }
        throw new Error("Wrong instruction or format");
    }
}