import React from 'react';
//import './App.css';
import { Pipeline } from './sim_core/pipeline';
import { Parser } from './sim_core/parser'
import { Controlled as CodeMirror } from 'react-codemirror2-react-17'

import 'codemirror/lib/codemirror.css';
import 'codemirror-dlx/theme/dlx-dark.css'
require('codemirror-dlx/mode/dlx')


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
  outputValue: string
}

class Neco extends React.Component<MyProps, MyState> {

  constructor(props: any) {
    super(props);
    this.setOutput = this.setOutput.bind(this);
    this.state = { value: "add $t1 $t2 $t3", pipeline: new Pipeline(this.setOutput), parser: new Parser(), inputValue: "", outputValue: "" };
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
    this.state.pipeline.setProgram(parsed);
  }

  render() {
    return (
      <div>
        <CodeMirror
          value={this.state.value}
          options={{
            mode: 'dlx',
            theme: 'dlx-dark',
            lineNumbers: true
          }}
          onBeforeChange={(editor, data, value) => {
            this.setState({ value });
          }}
          onChange={(editor, data, value) => {
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
      </div>
    )
  }
}

export default App;
