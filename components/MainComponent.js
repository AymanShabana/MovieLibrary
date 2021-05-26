import React, {Component} from 'react';
import { View, Platform, Image, StyleSheet, ScrollView, Text, ToastAndroid } from 'react-native';
import {connect} from 'react-redux';
import {fetchMovies} from '../redux/ActionCreators';
import NetInfo from "@react-native-community/netinfo";
import MovieList from './MovieListComponent';
import * as Expo from 'expo';
import Constants from 'expo-constants';

const mapStateToProps = state => {
    return {
        movies: state.movies
    }
}
const mapDispatchToProps = dispatch =>({
    fetchMovies: () => dispatch(fetchMovies())
})

class Main extends Component {
    
    constructor(props){
        super(props);
        this.unsubscribe = null;
    }

    componentDidMount(){
        this.props.fetchMovies();
        NetInfo.fetch().then(state => {
            ToastAndroid.show("Initial Network Connectivity Type: "+state.type+", isConnected: "+state.isConnected,
            ToastAndroid.LONG);
          });

        this.unsubscribe = NetInfo.addEventListener(state => {
            this.handleConnectivityChange(state);
        });
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    handleConnectivityChange = (connectionInfo) => {
        switch(connectionInfo.type){
            case 'none':
                ToastAndroid.show("You are now offline!",ToastAndroid.LONG);
                break;
            case 'wifi':
                ToastAndroid.show("You are now on WiFi!",ToastAndroid.LONG);
                break;
            case 'cellular':
                ToastAndroid.show("You are now on Mobile Data!",ToastAndroid.LONG);
                break;
            case 'unknown':
                ToastAndroid.show("You are now on an unknown connection!",ToastAndroid.LONG);
                break;
            default:
        }
    }
    render() {
        return(
            <View style={{flex:1,paddinTop: Platform.OS === 'ios'?0:10}}>
                <MovieList/> 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    drawerHeader: {
        backgroundColor: '#512da8',
        height:140,
        alignItems: 'center',
        justifyContent: 'center',
        flex:1,
        flexDirection: 'row'
    },
    drawerHeaderText:{
        color:'white',
        fontSize:24,
        fontWeight: 'bold'
    },
    drawerImage:{
        margin:10,
        width:80,
        height:60
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(Main);
