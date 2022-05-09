/*
	Modul: App.tsx
	Autor: Hůlek Matěj
*/

import { useState } from 'react';
import { Pipeline } from './sim_core/pipeline';
import { Parser } from './sim_core/parser'
import * as R from './sim_core/register';
import * as M from './sim_core/memory';

import { useSelector, useDispatch, Provider } from 'react-redux'
import * as actions from './actions'

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { StagesState } from './sim_core/pipeline';
import { store } from './index';

import Editor from './components/Editor';
import ErrorModal from './components/ErrorModal';
import SvgContainer from './components/SvgContainer';
import { Buttons, Inputs, Checkboxes } from './components/Inputs';

export function setError(error: string) {
	store.dispatch(actions.setError(error))
	throw new Error(error)
}

export interface errorState {
	isError: boolean,
	message: string
}

type RootState = ReturnType<typeof store.getState>

function App() {
	const [value, setValue] = useState("add $10 $11 $12")
	const [pipeline] = useState(new Pipeline())
	const [parser] = useState(new Parser())
	const [isForwarding, setIsForwarding] = useState(true)
	const [isHazard, setIsHazard] = useState(true)
	const [assembled, setAssembled] = useState(false)
	const [running, setRunning] = useState(false)

	const [base, setBase] = useState('Data')
	const [start, setStart] = useState(M.dataRange.from);
	const [end, setEnd] = useState(M.dataRange.from + 4 * 20);

	const inputValue = useSelector((state: RootState) => state.inputValue)
	const outputValue: string = useSelector((state: RootState) => state.outputValue);
	const stagesState: StagesState = useSelector((state: RootState) => state.stagesState);
	const registers: R.IAllRegister[] = useSelector((state: RootState) => state.registers);
	const memory: ArrayBuffer = useSelector((state: RootState) => state.memory);
	const error: errorState = useSelector((state: RootState) => state.error);
	const dispatch = useDispatch()

	let Assemble = () => {
		pipeline.reset()
		parser.reset()
		dispatch(actions.clearStageState())
		dispatch(actions.setOutputValue(""))
		let parsed = parser.parse(value)
		pipeline.setProgram(parsed, isForwarding, isHazard);
		setAssembled(true)
	}

	let step = () => {
		pipeline.step(endCallback);
	}

	let stop = () => {
		pipeline.reset()
		dispatch(actions.clearStageState())
		setAssembled(false)
		setRunning(false)
		setBase('Data')
		setStart(M.dataRange.from);
		setEnd(M.dataRange.from + 4 * 20);
	}

	let run = () => {
		pipeline.run(endCallback)
		setRunning(true)
	}

	let endCallback = () => {
		setRunning(false)
		setAssembled(false)
	}

	let pause = () => {
		pipeline.pause()
		setRunning(false)
	}

	let closeErrorModal = () => {
		dispatch(actions.clearError())
		setAssembled(false)
	}

	let setInputValue = (value: string) => {
		dispatch(actions.setInputValue(value))
	}

	let setMemoryRange = (start: number, end: number) => {
		pipeline.updateMemoryRangeBuffer(start, end)
	}

	return (
		<Provider store={store}>
			<Box sx={{ flexGrow: 1 }}>
				<ErrorModal
					error={error}
					closeErrorModal={closeErrorModal}
				/>
				<Grid container spacing={0}>
					<Grid item xl={3} sm={4} xs={12}>
						<Editor
							value={value}
							setValue={setValue}
							assembled={assembled}
							stagesState={stagesState}
						/>
					</Grid>

					<Grid item xl={9} sm={8} xs={12}>
						<SvgContainer
							stagesState={stagesState}
							registers={registers}
							isForwarding={isForwarding}
							isHazard={isHazard}
							memory={memory}
							setMemoryRange={setMemoryRange}
							base={base}
							setBase={setBase}
							start={start}
							setStart={setStart}
							end={end}
							setEnd={setEnd}
						/>

					</Grid>
					<Grid item xs="auto">
						<Buttons
							run={run}
							step={step}
							Assemble={Assemble}
							stop={stop}
							pause={pause}
							setValue={setValue}
							assembled={assembled}
							running={running}
						/>
					</Grid>
					<Grid item xs="auto">
						<Inputs
							inputValue={inputValue}
							setInputValue={setInputValue}
							outputValue={outputValue}
							assembled={assembled}
							isForwarding={isForwarding}
							isHazard={isHazard}
							setIsForwarding={setIsForwarding}
							setIsHazard={setIsHazard}
						/>
					</Grid>
					<Grid item xs="auto">
						<Checkboxes
							assembled={assembled}
							isForwarding={isForwarding}
							isHazard={isHazard}
							setIsForwarding={setIsForwarding}
							setIsHazard={setIsHazard}
						/>
					</Grid>
				</Grid>
			</Box>

		</Provider>
	)
}

export default App;
