import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './component/Filter.jsx';
import SetGenerator from './component/SetGenerator.jsx';
import SetsList from './component/SetsList.jsx';
import EditSet from './component/EditSet.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {

	return (
		<Router>
			<Routes>
			<Route path="/" element={<SetGenerator/> } />
			<Route path="/sets" element={<SetsList />} />
			<Route path="/edit-set" element={<EditSet />} />
			</Routes>
		</Router>
	);
};

export default App;
