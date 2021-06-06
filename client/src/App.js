import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Start from './components/Start';
import Dashboard from './components/DesignEdit';

export default function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Switch>
					<Route path='/' component={Start} exact={true} />
					<Route path='/:shop' component={Home} exact={true} />
					<Route
						path='/:shop/:name'
						render={(props) => <Dashboard {...props} />}
						exact={true}
					/>
				</Switch>
			</BrowserRouter>
		</div>
	);
}
