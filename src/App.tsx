import React from 'react';
//import './App.css';
import { Pipeline } from './sim_core/pipeline';
import { Parser } from './sim_core/parser'

import { SvgLoader, SvgProxy } from 'react-svgmt';
import pipelineSVG from './pipeline-minify.svg';

import AceEditor from "react-ace";
import 'brace/mode/mips_assembler';

import "brace/theme/tomorrow_night"
import 'brace/theme/monokai';
import "brace/theme/cobalt"
import "brace/theme/twilight"
import "brace/theme/sqlserver"

type theme = { braceName: string, name: string }
const themes: theme[] = [{ braceName: "tomorrow_night", name: "tomorrow night" },
{ braceName: "monokai", name: "monokai" },
{ braceName: "cobalt", name: "cobalt" },
{ braceName: "twilight", name: "twilight" },
{ braceName: "sqlserver", name: "sqlserver" }]

function App() {
  return (
    <Neco></Neco>
  );
}

interface MyProps {
}

interface MyState {
  value: string,
  pipeline: Pipeline,
  parser: Parser,
  inputValue: string,
  outputValue: string,
  isForwarding: boolean,
  editor: string
}

class Neco extends React.Component<MyProps, MyState> {

  constructor(props: any) {
    super(props);
    this.setOutput = this.setOutput.bind(this);
    this.state = {
      value: "add $t1 $t2 $t3",
      pipeline: new Pipeline(this.setOutput, true),
      parser: new Parser(),
      inputValue: "",
      outputValue: "",
      isForwarding: true,
      editor: themes[0].braceName
    };
  }

  run = () => {
    this.state.pipeline.run(this.state.inputValue);
  }

  setOutput = (output: string) => {
    this.setState({
      outputValue: output
    });
  }


  compile = () => {
    let parsed = this.state.parser.parse(this.state.value)
    this.state.pipeline.setProgram(parsed, this.state.isForwarding);
  }

  render() {
    return (
      <div>
        <AceEditor
          className={"IDE"}
          mode="mips_assembler"
          theme={this.state.editor}
          fontSize={16}
          style={{ width: "100%", height: "665px" }}
          name="mipsIDE"
          editorProps={{ $blockScrolling: true }}
          setOptions={{ tabSize: 4, wrap: false }}
          showPrintMargin={false}
          value={this.state.value}
          onChange={(value) => {
            this.setState({ value })
          }}
        />
        <button onClick={this.run}>
          RUN
        </button>
        <button onClick={this.compile}>
          COMPILE
        </button>
        <input type="text" placeholder="output" value={this.state.outputValue} readOnly />
        <input type="text" placeholder="intput" value={this.state.inputValue} onChange={(event) => {
          this.setState({
            inputValue: event.target.value
          });
        }} />
        <label>
          <input type="checkbox" checked={this.state.isForwarding} onChange={(event) => {
            this.setState({
              isForwarding: event.target.checked
            });
          }} />
          Forwarding
        </label>
        <select value={this.state.editor} onChange={(event) => this.setState({ editor: event.target.value })}>
          {themes.map((theme) => {
            return <option value={theme.braceName} key={theme.braceName}>{theme.name}</option>
          })}
        </select>
        <SvgLoader path={pipelineSVG} >
        </SvgLoader>

      </div>
    )
  }
}

export default App;
