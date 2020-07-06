import React, {Component} from 'react';
import {Text,View, Alert, StyleSheet, FlatList, TouchableHighlight, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@ant-design/react-native';
import CusCarousel from '../components/carousel';
import BookItem from '../components/bookItem';
import Divider from '../components/divider';
import {postRequest} from '../utils/fetch';
import {apiUrl} from '../urlconfig';

const GET_Books = apiUrl + "/getBooks";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "rgb(255,249,245)",
    },
    carousel:{
        marginTop: 8,
    }

});

class BookListScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            preSearchData:[],
            bookData:[],
        }
    }

    componentDidMount(){
        const callback = (data) =>{
            this.setState({bookData:data, preSearchData:data});
        };
        postRequest(GET_Books,{},callback);
    }

    onChange = (text) =>{
        this.setState({searchText: text});
    };

    onClear = () =>{
        this.setState({searchText: ""});
    };

    onSubmit = () =>{
        let _preSearchData = [...this.state.preSearchData];
        let _searchText = this.state.searchText;
        if(this.state.searchText.length === 0){
            this.setState({bookData:_preSearchData});
        }
        else{
            _preSearchData = _preSearchData.filter((ele)=>{
                let pattern = new RegExp(_searchText.toString(),"i");
                return pattern.test(ele["name"]);
            });
            this.setState({bookData:_preSearchData});
        }

        // Alert.alert(this.state.searchText);
    };

    navigateToDetail = ({item}) => {
        this.props.navigation.push("BookDetail",{bookInfo:item})
    };

    renderBook = ({item}) =>{
        return(
            <>
                <TouchableHighlight onPress={() => {this.navigateToDetail({item});}}>
                        <BookItem bookInfo={item}/>
                </TouchableHighlight>
                <Divider/>
            </>
        );
    };

    render(){
        return(
            <SafeAreaView style={styles.container}>
                <View>
                    <SearchBar placeholder="搜索"
                               value={this.state.searchText}
                               onChange={this.onChange}
                               onCancel={this.onClear}
                               onSubmit={this.onSubmit}
                    />
                </View>
                <View style={styles.carousel}>
                    <CusCarousel/>
                </View>
                <View style={{marginTop:10}}>
                    <FlatList
                        data={this.state.bookData}
                        renderItem={this.renderBook}
                        keyExtractor={item => item.id}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

export default BookListScreen;
