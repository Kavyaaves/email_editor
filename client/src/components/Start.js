import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Button = styled.button`
	text-align: center;
	color: black;
	padding: 2rem;
	left: 40%;
	border: 1px solid black;
	background-color: transparent;
	top: 40%;
	border-radius: 5px;
	display: flex;
	position: fixed;
	&:hover {
		background-color: black;
		color: white;
	}
`;

const Start = () => {
	const handleSubmit = async (e) => {
		e.preventDefault();
		window.location.replace(
			'https://editor-email.myshopify.com/admin/oauth/install_custom_app?client_id=c77fbe2461b350d513b24277f2f68c66&signature=eyJfcmFpbHMiOnsibWVzc2FnZSI6ImV5SmxlSEJwY21WelgyRjBJam94TmpJek1EWTJOVFV3TENKd1pYSnRZVzVsYm5SZlpHOXRZV2x1SWpvaVpXUnBkRzl5TFdWdFlXbHNMbTE1YzJodmNHbG1lUzVqYjIwaUxDSmpiR2xsYm5SZmFXUWlPaUpqTnpkbVltVXlORFl4WWpNMU1HUTFNVE5pTWpReU56ZG1NbVkyT0dNMk5pSXNJbkIxY25CdmMyVWlPaUpqZFhOMGIyMWZZWEJ3SW4wPSIsImV4cCI6IjIwMjEtMDYtMTRUMTE6NDk6MTAuMDI0WiIsInB1ciI6bnVsbH19--1b551dd7a2065ae8c2dfd7c92307441332914dcd'
		);
		axios.get('http://localhost:5000/').then((res) => {});
	};

	return (
		<div>
			<Button onClick={handleSubmit}>
				Email Editor Shop
				<br />
				<br />
				SIGN IN OR SIGN UP
			</Button>
		</div>
	);
};

export default Start;
