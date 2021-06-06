import React, { useState } from 'react';
import styled from 'styled-components';

const Input = styled.input`
	outline: none;
	padding: 2px;
	border: none;
	border-bottom: 2px solid black;
	width: 100%;
`;

const Button = styled.div`
	// background-color: black;
	// margin: auto;
	// padding: 2px;
	// width: 50%;
	// color: #fff;
	// border-radius: 5px;
	// cursor: pointer;
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
`;
const NewDesign = ({ open, setName, options }) => {
	const [newName, setNewName] = useState(null);
	return (
		<div>
			<h3>Create a new template</h3>
			<br />
			<Input
				onChange={(e) => {
					setNewName(e.target.value);
				}}></Input>{' '}
			<br />
			<br />
			<Button
				onClick={(e) => {
					e.preventDefault();
					setName(newName);
					open(false);
				}}>
				+
			</Button>
			<br />
			<Button
				onClick={() => {
					open(false);
				}}>
				Close
			</Button>
			<br />
		</div>
	);
};

export default NewDesign;
