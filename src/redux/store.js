import {applyMiddleware, createStore} from 'redux';
// import {persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import Reducers from './Reducers';

const store = createStore(Reducers, applyMiddleware(thunk));
// const persistor = persistStore(store);

export { store};
