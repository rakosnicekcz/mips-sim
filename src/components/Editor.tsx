import AceEditor, { IMarker } from "react-ace";
import { StagesState } from '../sim_core/pipeline';
import 'brace/mode/mips_assembler';
import "brace/theme/sqlserver"

type EditorProps = {
    value: string,
    setValue: (string) => void,
    assembled: boolean,
    stagesState: StagesState
};

const Editor: React.FC<EditorProps> = (props) => {

    let markers: IMarker[] = []

    for (const prop in props.stagesState) {
        if (props.stagesState[prop].instruction.line !== -1) {
            markers.push({
                startRow: props.stagesState[prop].instruction.line - 1, type: "fullLine", className: prop + "_stage",
                startCol: 0, endCol: props.stagesState[prop].instruction.originalNotation.length, endRow: props.stagesState[prop].instruction.line - 1
            })
        }
    }

    return (
        <AceEditor
            className={"IDE"}
            mode="mips_assembler"
            theme={"sqlserver"}
            fontSize={16}
            style={{ height: "100%", width: "100%", minHeight: "500px" }}
            name="mipsIDE"
            editorProps={{ $blockScrolling: true }}
            setOptions={{ tabSize: 4, wrap: false }}
            showPrintMargin={false}
            value={props.value}
            onChange={(value) => {
                props.setValue(value)
            }}
            readOnly={props.assembled}
            markers={props.assembled ? markers : []}
            highlightActiveLine={!props.assembled}
        />
    )
}

export default Editor;