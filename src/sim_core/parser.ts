enum ParsingArea {
    text,
    data
}

export class Parser {
    private parsingArea: ParsingArea = ParsingArea.text
    private globl: string

    parse(code: string) {
        console.log(code)
        let codeLines = code.split("\n").map((e) => { return e.split(/#(?![^"]*")/g)[0].trim() });
        for (const line of codeLines) {
            let lineParts = this.getLineParts(line)

            if (line === "") {
                continue;
            } else if (line === ".text") {
                this.parsingArea = ParsingArea.text
            } else if (line === ".data") {
                this.parsingArea = ParsingArea.data
            } else if (lineParts[0] === ".globl" && lineParts.length === 2) {
                this.globl = lineParts[1];
            }
        }
        console.log(codeLines)
    }

    private getLineParts(line: string): string[] {
        let lineParts = line.split(" ");
        lineParts = lineParts.filter(e => { return e !== "" })
        return lineParts.map(e => { return e.trim() })
    }
}