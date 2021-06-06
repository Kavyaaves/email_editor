import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import EmailEditor from 'react-email-editor';
import axios from 'axios';
import { Redirect } from 'react-router';

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
`;

const DesignEdit = (props) => {
	const emailEditorRef = useRef(null);
	const [json, setJson] = useState(null);
	const [html, setHtml] = useState(null);
	const [redirect, setRedirect] = useState(false);

	const shop = window.location.pathname.split('/')[1];
	const template = window.location.pathname.split('/')[2];

	const saveDesign = async () => {
		await emailEditorRef.current.editor.saveDesign((design) => {
			setJson(design);
		});
		await emailEditorRef.current.editor.exportHtml((data) => {
			setHtml(data.html);
		});
		if (json && html && template) {
			axios
				.post(
					`http://localhost:5000/template/save/${shop}`,
					{ name: template, json, html },
					{
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': 'http://localhost:5000',
						},
					}
				)
				.then((response) => {
					alert('Success');
				})
				.catch((error) => {
					alert('Error');
				});
		}
	};

	useEffect(() => {
		if (props.location.state === null || '' || undefined) {
			window.location.reload();
		}
		onLoad();
	}, []);
	const deleteDesign = async () => {
		axios
			.post('http://localhost:5000/template/delete/' + template, {
				shop,
				template,
			})
			.then(() => {
				props.history.push({ pathname: '/' + shop });
			});
	};

	const onLoad = () => {
		emailEditorRef?.current?.editor.loadDesign(props.location.state);
	};

	return (
		<Container>
			<Bar>
				<h1>React Email Editor (Demo)</h1>
				<br />
				<h1>{template}</h1>
				<button onClick={deleteDesign}>Delete Design</button>

				<button onClick={saveDesign}>Save Design</button>
			</Bar>
			{props.location.state && (
				<React.StrictMode>
					<EmailEditor ref={emailEditorRef} onLoad={onLoad} />
				</React.StrictMode>
			)}
			{redirect && <Redirect to={'http://localhost:3000/' + shop} />}
		</Container>
	);
};

export default DesignEdit;
