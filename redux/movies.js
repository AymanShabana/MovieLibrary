import * as ActionTypes from './ActionTypes';

export const movies = (state ={
        isLoading: true,
        errMess: null,
        movies: [],
    }, action) =>{
        switch(action.type){
            case ActionTypes.ADD_MOVIES:
                return {...state, isLoading:false, errMess:null, movies: [...state.movies, ...action.payload.results]}
            case ActionTypes.MOVIES_LOADING:
                return {...state, isLoading:true, errMess:null, movies: []}
            case ActionTypes.MOVIES_FAILED:
                return {...state, isLoading:false, errMess:action.payload, movies:[] }
            default:
                return state;
        }
    }