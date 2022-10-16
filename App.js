import { useState } from "react";

import './src/util/auth' // Inicializa App y Auth

import AuthContextProvider from './src/store/auth-context';
import AnimatedSplashScreen from "./src/startup/AnimatedSplashScreen";
import Navigation from "./src/startup/Navigation";


export default function App() {
	const [appLoading, setAppLoading] = useState(true);

	function onFinishHandler() {
		setAppLoading(false);
	}

	return (
		<>
		{
			appLoading ?
				<AnimatedSplashScreen
					onFinish={onFinishHandler}
				/>
			:
				<AuthContextProvider>
					<Navigation />
				</AuthContextProvider>
		}
		</>
	);
}
