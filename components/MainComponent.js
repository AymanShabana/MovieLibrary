import React, {Component} from 'react';
import { View, Platform, StyleSheet, Text, ToastAndroid, FlatList, ActivityIndicator } from 'react-native';
import {connect} from 'react-redux';
import {fetchMovies} from '../redux/ActionCreators';
import NetInfo from "@react-native-community/netinfo";
import * as Expo from 'expo';
import Constants from 'expo-constants';
import { Loading } from './LoadingComponent';
import { imagesUrl } from '../shared/imagesUrl';
import { Tile } from 'react-native-elements';
import {baseUrl} from '../shared/baseUrl';


const mapStateToProps = state => {
    return {
        movies: state.movies
    }
}
const mapDispatchToProps = dispatch =>({
    fetchMovies: (page) => dispatch(fetchMovies(page))
})

class Main extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            page:1,
            fetching:false,
            movies:[],
            offline:false
        }
        this.unsubscribe = null;
    }


    UNSAFE_componentWillMount(){
        console.log('componentDidMount()');
        NetInfo.fetch().then(state => {
            ToastAndroid.show("Initial Network Connectivity Type: "+state.type+", isConnected: "+state.isConnected,
            ToastAndroid.LONG);
            if(!this.state.offline)
                this._fetchMovies();
          });

        this.unsubscribe = NetInfo.addEventListener(state => {
            this.handleConnectivityChange(state);
        });
    }
    componentWillUnmount(){
        this.unsubscribe();
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        console.log("DONE REFRESHING");
        this.setState({
            fetching: false
        });    
    }

    _fetchMovies(){
        this.props.fetchMovies(this.state.page);
    }

    loadNextSetOfMovies = () => {
        console.log('loadNextSetOfMovies()');
        if(!this.state.offline){
            this.setState({
                page: this.state.page + 1,
                fetching: true
            }, () => {
                console.log("REFRESHING");
                this._fetchMovies();
            });
        }
    }

    handleConnectivityChange = (connectionInfo) => {
        switch(connectionInfo.type){
            case 'none':
                ToastAndroid.show("You are now offline!",ToastAndroid.LONG);
                this.setState({
                    offline:true
                })
                break;
            case 'wifi':
                ToastAndroid.show("You are now on WiFi!",ToastAndroid.LONG);
                break;
                this.setState({
                    offline:false
                })
            case 'cellular':
                ToastAndroid.show("You are now on Mobile Data!",ToastAndroid.LONG);
                this.setState({
                    offline:false
                })
                break;
            case 'unknown':
                ToastAndroid.show("You are now on an unknown connection!",ToastAndroid.LONG);
                this.setState({
                    offline:false
                })
                break;
            default:
        }
    }
    displayLoading() {
        if (this.state.fetching) {
            return <Loading/>;
        }
    }
    renderData(){
        console.log(JSON.stringify(this.props));
        if(this.state.offline && this.props.movies.movies.size==0){
            return <Text adjustsFontSizeToFit={true} numberOfLines={1}>Please connect to the internet</Text>
        }
        else{
            if(this.props.movies.isLoading){
                return (<Loading/>);
            }
            else{
                // console.log('item = '+JSON.stringify(this.props.movies.movies));
                // this.props.movies.movies.filter((object,index) => index === this.props.movies.movies.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
                return (
                    <View style={[styles.container, {
                        flexDirection: "column"
                      }]}>
                    <FlatList 
                data={this.props.movies.movies}
                renderItem={({item}) => (
                    <Tile
                    key={item.id}
                    title={item.title}
                    caption={item.overview+'\n\n'+item.release_date}
                    featured
                    imageSrc={{ uri: imagesUrl+item.poster_path}}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                onEndReached ={this.loadNextSetOfMovies}
                onEndReachedThreshold={0.01}
                refreshing ={this.state.fetching}
                />
                {this.state.fetching && (<ActivityIndicator size="large" color='#000000'/>)}
                </View>)
            }
    
        }
    }
    render() {
        return(
            <View style={{flex:1,paddinTop: Platform.OS === 'ios'?0:10}}>
                {this.renderData()}
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
