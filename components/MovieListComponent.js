import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Tile } from 'react-native-elements';
import {connect} from 'react-redux';
import {baseUrl} from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import { imagesUrl } from '../shared/imagesUrl';

const mapStateToProps = state => {
    return {
        movies: state.movies
    }
}
class MovieList extends Component {
    render(){
        const renderMovieItem = ({item, index}) => {
            return (
                <Tile
                    key={index}
                    title={item.title}
                    caption={item.overview+'\n\n'+item.release_date}
                    featured
                    imageSrc={{ uri: imagesUrl+item.poster_path}}
                    />
            );
        };
        
        if(this.props.movies.isLoading){
            return(
                <Loading/>
            );
        }
        else if(this.props.movies.errMess){
            console.log('errmess = '+JSON.stringify(this.props.movies.errMess));
            return(
                <View>
                    <Text>{this.props.movies.errMess}</Text>
                </View>
            );
        }
        else{
            console.log('item = '+JSON.stringify(this.props.movies.movies));
            return (
                <FlatList 
                    data={this.props.movies.movies}
                    renderItem={renderMovieItem}
                    keyExtractor={item => item.id.toString()}
                    />
            );
    
        }
    }
    
}


export default connect(mapStateToProps)(MovieList);
