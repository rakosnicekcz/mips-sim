import React, { useState, useEffect } from 'react';
import { Pipeline } from './sim_core/pipeline';
import { Parser } from './sim_core/parser'
import * as R from './sim_core/registr';

import { SvgLoader, SvgProxy } from 'react-svgmt';

import { createStore } from 'redux'
import { useSelector, useDispatch, Provider } from 'react-redux'
import * as actions from './actions'
import { rootReducer } from './reducers';

import TpipelineSVG from './images/pipeline-minify.svg';
import pipelineSVG_noHazard from './images/pipeline-no-hazard.svg';
import pipelineSVG_noForwarding from './images/pipeline-no-forwarding.svg';
import pipelineSVG_noAll from './images/pipeline-no-forwarding-and-hazard.svg';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Switch from '@mui/material/Switch';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HandymanIcon from '@mui/icons-material/Handyman';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';

import AceEditor, { IMarker } from "react-ace";
import 'brace/mode/mips_assembler';
import "brace/theme/sqlserver"

import { StagesState } from './sim_core/pipeline';


type TpipelineSVG = { forwarding: boolean, hazard: boolean, path: string }
const pipelineSVGs: TpipelineSVG[] = [
	{ forwarding: true, hazard: true, path: TpipelineSVG },
	{ forwarding: false, hazard: true, path: pipelineSVG_noForwarding },
	{ forwarding: true, hazard: false, path: pipelineSVG_noHazard },
	{ forwarding: false, hazard: false, path: pipelineSVG_noAll }
]

export const store = createStore(
	rootReducer
)

function App() {
	return (
		<ErrorBoundary>
			<Provider store={store}>
				<Nic></Nic>
			</Provider>
		</ErrorBoundary>
	);
}

type RootState = ReturnType<typeof store.getState>

function Nic() {
	const [value, setValue] = useState("add $10 $11 $12")
	const [pipeline, setPipeline] = useState(new Pipeline())
	const [parser, setParser] = useState(new Parser())
	const [isForwarding, setIsForwarding] = useState(true)
	const [isHazard, setIsHazard] = useState(true)
	const [assembled, setAssembled] = useState(false)
	const [running, setRunning] = useState(false)
	const [isHexa, setIsHexa] = useState(true)
	const pipelineSVGpath = pipelineSVGs.find(e => e.forwarding === isForwarding && e.hazard === isHazard)?.path
	const inputValue = useSelector((state: RootState) => state.inputValue)
	const outputValue = useSelector((state: RootState) => state.outputValue);
	const stagesState: StagesState = useSelector((state: RootState) => state.stagesState);
	const registers: R.IAllRegister[] = useSelector((state: RootState) => state.registers);
	const dispatch = useDispatch()

	let markers: IMarker[] = []

	for (const prop in stagesState) {
		if (stagesState[prop].instruction.line !== -1) {
			markers.push({
				startRow: stagesState[prop].instruction.line - 1, type: "fullLine", className: prop + "_stage",
				startCol: 0, endCol: stagesState[prop].instruction.originalNotation.length, endRow: stagesState[prop].instruction.line - 1
			})
		}
	}

	let Assemble = () => {
		pipeline.reset()
		parser.reset()
		dispatch(actions.clearStageState())
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
	}

	let run = () => {
		pipeline.run(endCallback)
		setRunning(true)
	}

	let endCallback = () => {
		console.log("end")
		setRunning(false)
		setAssembled(false)
	}

	let pause = () => {
		pipeline.pause()
		setRunning(false)
	}

	return (<div>
		<Box sx={{ flexGrow: 1 }}>
			<Grid container spacing={0}>
				<Grid item xl={3} sm={4} xs={12}>
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
						value={value}
						onChange={(value) => {
							setValue(value)
						}}
						readOnly={assembled}
						markers={assembled ? markers : []}
						highlightActiveLine={!assembled}
					/>
				</Grid>
				<Grid item xl={9} sm={8} xs={12}>
					<div className="svgLoaderContainer">
						<SvgLoader path={pipelineSVGpath} className="svgLoader">
							<SvgProxy selector="#if_instr" children={stagesState.if.instruction.originalNotation} />
							<SvgProxy selector="#id_instr" children={stagesState.id.instruction.originalNotation} />
							<SvgProxy selector="#ex_instr" children={stagesState.ex.instruction.originalNotation} />
							<SvgProxy selector="#mem_instr" children={stagesState.mem.instruction.originalNotation} />
							<SvgProxy selector="#wb_instr" children={stagesState.wb.instruction.originalNotation} />
						</SvgLoader>
						<div className='registersContainer'>
							<Accordion>
								<AccordionSummary expandIcon={<ExpandMoreIcon />}>
									Registers
								</AccordionSummary>
								<AccordionDetails>
									<FormControlLabel control={
										<Switch checked={isHexa} onChange={(event) => { setIsHexa(event.target.checked) }} />}
										label="Hexadecimal" />
									<TableContainer sx={{ maxHeight: "50vh" }}>
										<Table size="small" >
											<TableHead>
												<TableRow>
													<TableCell>Name</TableCell>
													<TableCell align="right">Value</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{registers.map((row) => (
													<TableRow key={row.name}
														sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
													>
														<TableCell component="th" scope="row">
															{row.name}
														</TableCell>
														<TableCell align="right">{isHexa ? '0x' + row.value[0].toString(16) : row.value[0]}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</AccordionDetails>
							</Accordion>
						</div>
					</div>

				</Grid>
				<Grid item xs="auto">
					<Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} margin={"10px"}>
						<Button variant="contained" onClick={run} startIcon={<PlayArrowIcon />} disabled={!assembled} >
							RUN
						</Button>
						<Button variant="contained" onClick={step} startIcon={<MoveDownIcon />} disabled={!assembled || running} >
							STEP
						</Button>
						<Button variant="outlined" onClick={Assemble} startIcon={<HandymanIcon />} disabled={assembled}>
							ASSEMBLE
						</Button>
						<div>
							<IconButton color="warning" disabled={!running} onClick={pause}>
								<PauseCircleOutlineOutlinedIcon fontSize="large" />
							</IconButton>
							<IconButton color="error" disabled={!assembled} onClick={stop}>
								<StopCircleOutlinedIcon fontSize="large" />
							</IconButton>
						</div>
					</Stack>
				</Grid>
				<Grid item xs="auto">
					<Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} margin={"10px"}>
						<TextField
							label="Output"
							value={outputValue}
							sx={{ maxWidth: { xs: "200px" } }}
							InputProps={{
								readOnly: true,
							}}
						/>
						<TextField
							label="Input"
							value={inputValue}
							sx={{ maxWidth: { xs: "200px" } }}
							onChange={(event) => {
								dispatch(actions.setInputValue(event.target.value))
							}}
						/>
						<FormControlLabel control={
							<Checkbox
								checked={isForwarding}
								onChange={(event) => {
									setIsForwarding(event.target.checked)
								}}
								disabled={assembled}
							/>
						} label="Forwarding" sx={{ display: { xs: 'block', sm: 'none' } }} />

						<FormControlLabel control={
							<Checkbox
								checked={isHazard}
								onChange={(event) => {
									setIsHazard(event.target.checked)
								}}
								disabled={assembled}
							/>
						} label="Hazard Unit" sx={{ display: { xs: 'block', sm: 'none' } }} />
					</Stack>
				</Grid>
				<Grid item xs="auto">
					<Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ display: { xs: 'none', sm: 'block' } }} margin={"10px"}>
						<FormControlLabel control={
							<Checkbox
								checked={isForwarding}
								onChange={(event) => {
									setIsForwarding(event.target.checked)
								}}
								disabled={assembled}
							/>
						} label="Forwarding" />

						<FormControlLabel control={
							<Checkbox
								checked={isHazard}
								onChange={(event) => {
									setIsHazard(event.target.checked)
								}}
								disabled={assembled}
							/>
						} label="Hazard Unit" />
					</Stack>
				</Grid>
			</Grid>
		</Box>

	</div >
	)
}

class ErrorBoundary extends React.Component<{}, { error: any }> {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}

	componentDidCatch(error) {
		// Catch errors in any components below and re-render with error message
		this.setState({
			error: error
		})
		// You can also log error messages to an error reporting service here
	}

	render() {
		if (this.state.error) {
			// Error path
			return (
				<div>
					<h2>Something went wrong.</h2>
				</div>
			);
		}
		// Normally, just render children
		return this.props.children;
	}
}

export default App;
