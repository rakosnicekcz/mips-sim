export enum EMemBitLenOperation {
    byte = 1,
    halfword = 2,
    word = 4
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
                return view.getInt8(offset);
            case EMemBitLenOperation.halfword:
                return view.getInt16(offset, true);
            case EMemBitLenOperation.word:
                return view.getInt32(offset, true);
        }
    }

    store(oplen: EMemBitLenOperation, offset: number, value: number): void {
        let view = new DataView(this.buffer)
        switch (oplen) {
            case EMemBitLenOperation.byte:
                view.setInt8(offset, value);
                break
            case EMemBitLenOperation.halfword:
                view.setInt16(offset, value, true);
                break
            case EMemBitLenOperation.word:
                view.setInt32(offset, value, true);
                break
        }
    }
}