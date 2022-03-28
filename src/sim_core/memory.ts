import deepcopy from "deepcopy";

export enum EMemBitLenOperation {
    byte = 1,
    halfword = 2,
    word = 4
}

export enum EMemStaticOperations {
    word = ".word",
    half = ".half",
    byte = ".byte",
    ascii = ".ascii",
    asciiz = ".asciiz",
    space = ".space",
    // align
}

export interface IMemStaticData {
    address: number;
    name: string;
    type: EMemStaticOperations;
    value: Int8Array;
}

export class Memory {
    private buffer: ArrayBuffer;
    constructor(bufferSize: number = 100) {
        this.buffer = new ArrayBuffer(bufferSize);
    }

    load(oplen: EMemBitLenOperation, offset: number): number {
        let view = new DataView(this.buffer)
        switch (oplen) {
            case EMemBitLenOperation.byte:
                return deepcopy(view.getInt8(offset));
            case EMemBitLenOperation.halfword:
                return deepcopy(view.getInt16(offset, true));
            case EMemBitLenOperation.word:
                return deepcopy(view.getInt32(offset, true));
        }
    }

    store(oplen: EMemBitLenOperation, offset: number, value: number): void {
        let view = new DataView(this.buffer)
        switch (oplen) {
            case EMemBitLenOperation.byte:
                view.setInt8(offset, deepcopy(value));
                break
            case EMemBitLenOperation.halfword:
                view.setInt16(offset, deepcopy(value), true);
                break
            case EMemBitLenOperation.word:
                view.setInt32(offset, deepcopy(value), true);
                break
        }
    }

    getBuffer(): ArrayBuffer {
        return this.buffer;
    }
}