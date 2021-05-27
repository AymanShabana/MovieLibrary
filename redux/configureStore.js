import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {movies} from './movies';
export const ConfigureStore = () =>{
    const store = createStore(
        combineReducers({
            movies
        }),
        applyMiddleware(thunk)
    );
    return store;
}
