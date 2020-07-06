import React, {Component}from 'react';
import {Text, View, Platform, BackHandler, Image, StyleSheet, ScrollView,
    TouchableHighlight, AsyncStorage, DeviceEventEmitter} from 'react-native';
import {Toast, Provider} from '@ant-design/react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Divider from '../components/divider';
import {_getData} from '../utils/localStorage';
import {apiUrl} from '../urlconfig';
import {postRequest} from '../utils/fetch';

const ADDCART_URL = apiUrl+"/addCart";

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    header:{
        justifyContent:"center",
        alignItems: "center",
        backgroundColor: "white",
    },
    mainContainer:{
        marginLeft:8,
        marginRight:8,
    },
    image:{
        width:230,
        height:230,
    },
    center:{
        justifyContent:"center",
        alignItems: "center",
    },
    title:{
        fontFamily:"Microsoft YaHei",
        fontSize:19,
    },
    description:{
        fontFamily:"Microsoft YaHei",
        color:"rgb(50, 50, 50)",
    },
    author:{
        fontFamily:"Microsoft YaHei",
        color:"rgb(100, 100, 150)",
    },
    price:{
        fontFamily:"Microsoft YaHei",
        fontSize:17,
        color:"rgb(255, 0, 0)",
    },
});

class DetailScreen extends Component{
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener("back", this.onBackClicked);
        }
    }

    componentWillUnmount(){
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener("back",this.onBackClicked);
        }
    }

    onBackClicked = () =>{
        let {showTab} = this.props.route.params;
        showTab();
        return false;
    };

    addCart = () =>{
        let bookInfo = this.props.route.params.bookInfo;
        AsyncStorage.getItem("user")
            .then(value => {
                let userData = JSON.parse(JSON.parse(value));
                let cartInfo = {
                    "userId":userData.userId,
                    "bookId": bookInfo.id,
                    "quantity": 1,
                };
                const callback = (data) =>{
                    console.log(data);
                    if(!data.status){
                        Toast.success(data.msg, 2);
                        DeviceEventEmitter.emit("flushCart",{});
                    }
                    else{
                        Toast.fail(data.msg, 2);
                    }
                };
                console.log(cartInfo["bookId"]);
                postRequest(ADDCART_URL,cartInfo,callback);
            })
            .catch(error => console.log(error));
    };

    goHome = () =>{
        let {showTab} = this.props.route.params;
        showTab();
        this.props.navigation.push("BookList");
    };

    goCart = () =>{
        let {showTab} = this.props.route.params;
        showTab();
        this.props.navigation.navigate("Cart");
    };

    render(){
        let bookInfo = this.props.route.params.bookInfo;
        let {hideTab} = this.props.route.params;
        hideTab();
        return(
            <Provider>
                <View style={styles.container}>
                    <View style={{flex:0.7, ...styles.header}}>
                        <Text>Book Detail</Text>
                    </View>
                    <View style={{flex:9,...styles.mainContainer}}>
                        <View style={{flex:6, ...styles.center}}>
                            <Image style={styles.image} source={{uri: bookInfo.bookImage.imageBase64}}/>
                        </View>
                        <View style={{flex:5.6}}>
                            <View style={{flex:1, justifyContent:"center"}}>
                                <Text style={styles.title}>{bookInfo.name}</Text>
                            </View>
                            <View style={{flex:0.8, flexDirection:"row"}}>
                                <View style={{flex:1, justifyContent:"center"}}>
                                    <Text style={styles.price}>￥{bookInfo.price}</Text>
                                </View>
                                <View style={{flex:1,  justifyContent:"center", alignItems: "flex-end"}}>
                                    <Text style={styles.author}>库存：{bookInfo.inventory}</Text>
                                </View>
                            </View>
                            <View style={{flex:0.7, justifyContent:"center"}}>
                                <Text style={styles.author}>{bookInfo.author}</Text>
                            </View>
                            <Divider/>
                            <View style={{flex:0.8}}>
                                <Text style={{...styles.author, fontSize:16}}>书籍简介</Text>
                            </View>
                            <View style={{flex:2}}>
                                <ScrollView style={{flex:1}}>
                                    <Text style={styles.description}>{bookInfo.description}</Text>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                    <View style={{flex:0.9, flexDirection:"row", backgroundColor:"white", marginTop:5}}>
                        <View style={{flex:1, ...styles.center}}>
                            <TouchableHighlight onPress={this.goHome}>
                                <View style={{flex:1, ...styles.center}}>
                                    <AntDesign name="home" color="rgb(120,120,120)" size={25}/>
                                    <Text style={{fontSize:12, color:"rgb(120,120,120)"}}>主页</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={{flex:1, ...styles.center}}>
                            <TouchableHighlight onPress={this.goCart}>
                                <View style={{flex:1, ...styles.center}}>
                                    <AntDesign name="shoppingcart" color="rgb(120,120,120)" size={25}/>
                                    <Text style={{fontSize:12, color:"rgb(120,120,120)"}}>购物车</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={{flex:2, backgroundColor:"rgb(255,152,24)"}}>
                            <TouchableHighlight style={{flex:1, ...styles.center}} onPress={this.addCart}>
                                <Text style={{fontFamily:"Microsoft YaHei", fontSize:16, color:"white"}}>加入购物车</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{flex:2, backgroundColor:"rgb(245,45,42)"}}>
                            <TouchableHighlight style={{flex:1, ...styles.center}} onPress={this.addCart}>
                                <Text style={{fontFamily:"Microsoft YaHei", fontSize:16, color:"white"}}>立即购买</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Provider>
        );
    }
}

export default DetailScreen;
