import AppCanvas from './AppCanvas';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {

	return (
		<Provider store={store}>
			<AppCanvas />
		</Provider>
	);
}

export default App;