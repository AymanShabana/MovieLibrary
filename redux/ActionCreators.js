import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../shared/baseUrl';


export const fetchMovies= (page) => {
    var url = baseUrl+`&page=${page}`;
    return (dispatch) => {
        fetch(url)
    .then(response => {
        if(response.ok){
            response.json();
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
    .then(movies => dispatch(addMovies(movies)))
    .catch(error => dispatch(moviesFailed(error.message)))
}

export const moviesFailed = (errmess) => ({
    type: ActionTypes.MOVIES_FAILED,
    payload: errmess
});

export const addMovies = (movies) => ({
    type: ActionTypes.ADD_MOVIES,
    payload:movies,
});