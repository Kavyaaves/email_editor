import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import EmailEditor from 'react-email-editor';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import NewDesign from './NewDesign';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	position: relative;
	height: 100%;
`;

const Bar = styled.div`
	flex: 1;
	background-color: #61dafb;
	color: #000;
	padding: 10px;
	display: flex;
	max-height: 40px;
	h1 {
		flex: 1;
		font-size: 16px;
		text-align: left;
	}
	button {
		flex: 1;
		padding: 10px;
		margin-left: 10px;
		font-size: 14px;
		font-weight: bold;
		background-color: #000;
		color: #fff;
		border: 0px;
		max-width: 150px;
		cursor: pointer;
	}
	a {
		flex: 1;
		padding: 10px;
		margin-left: 10px;
		font-size: 14px;
		font-weight: bold;
		color: #fff;
		border: 0px;
		cursor: pointer;
		text-align: right;
		text-decoration: none;
		line-height: 160%;
	}
`;

export default function DesignEdit(props) {
	const ref = useRef(null);
	const [list, setList] = useState([]);
	const [options, setOptions] = useState([]);
	const [defaultOption, setDefaultOption] = useState(null);
	const [design, setDesign] = useState(false);
	const [html, setHtml] = useState(null);
	const [json, setJson] = useState(null);
	const [templateJson, setTempJson] = useState(null);

	const [name, setName] = useState(null);
	var pageURL = window.location.href;
	var lastSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
	useEffect(() => {
		axios.get('http://localhost:5000/template/' + lastSegment).then((res) => {
			const arr = [];
			if (res.data !== undefined || 0) {
				res.data.map((doc, key) => {
					arr.push(doc.name);
				});
				setOptions(arr);
				setList(res.data);
			}
		});
	}, [name]);

	const newTemplate = (value) => {
		setDesign(false);
		setJson(null);
		setHtml(null);
	};

	const saveDesign = async () => {
		ref.current.saveDesign((design) => {
			setJson(design);
		});
		ref.current.exportHtml((data) => {
			setHtml(data.html);
		});
		const config = { name, json, html };
		if (json && html && name) {
			axios
				.post(`http://localhost:5000/template/save/${lastSegment}`, config, {
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': 'http://localhost:5000',
					},
				})
				.then((response) => {
					if (response.data.success) alert('Saved');
				});
		} else {
			alert('Give a valid name and design to save');
		}
	};

	const onSelect = (t) => {
		list.map((doc, key) => {
			if (doc.name === t.value) {
				setDefaultOption(t.value);
				setTempJson(doc.json);
			}
		});
	};
	if (templateJson) {
		props.history.push({
			pathname: '/editor-email/' + defaultOption,
			state: templateJson,
		});
	}

	return (
		<Container>
			<Bar>
				{/* <div> */}
				<h1>React Email Editor (Demo)</h1>
				{options.length !== 0 && (
					<Dropdown
						style={{ backgroundColor: '#fff' }}
						options={options}
						value={defaultOption}
						onChange={onSelect}
						placeholder='Select an option'
					/>
				)}
				<h1 style={{ textAlign: 'center' }}>{name}</h1>
				<button
					onClick={() => {
						setDesign(true);
					}}>
					New Design
				</button>
				<button onClick={saveDesign}>Save Design</button>
			</Bar>

			<EmailEditor ref={ref} />
			<dialog
				open={design}
				style={{
					top: '30%',
					border: '1px solid black',
					borderRadius: 'none',
					padding: 40,
				}}>
				<NewDesign open={newTemplate} setName={setName} options={options} />
			</dialog>
		</Container>
	);
}
