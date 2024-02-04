import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { ToastrContainer } from './components/toastr.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
			<ToastrContainer />
		</Provider>
	</React.StrictMode>,
)
