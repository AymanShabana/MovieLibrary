import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../shared/baseUrl';


export const fetchMovies= (page) => {
    console.log(`fetchMovies(${page})`);
    var url = baseUrl+`&page=${page}`;
    return (dispatch) => {
        return fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            var error = new Error('Error '+response.status+': '+response.text);
            error.response = response;
            throw error;
        }
    },
    error => {
        var errMess = new Error(error.message);
        throw errMess;
    })
    .then(movies => dispatch({
        type: ActionTypes.ADD_MOVIES,
        payload:movies
    }))
    .catch(error => dispatch({
        type: ActionTypes.MOVIES_FAILED,
        payload: error.message
    }));
}
}
