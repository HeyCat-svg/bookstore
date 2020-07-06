import React, {Component}from 'react';
import {Text, View, StyleSheet, ScrollView, FlatList, BackHandler,
    Image, Platform, TouchableHighlight, AsyncStorage, DeviceEventEmitter} from 'react-native';
import { Checkbox, Stepper,Toast, Provider } from '@ant-design/react-native';
import Divider from '../components/divider';
import {postRequest} from '../utils/fetch';
import {_getData} from '../utils/localStorage';
import {apiUrl} from '../urlconfig';


const GETCART_URL = apiUrl + "/getCart";
const SUBORDER_URL = apiUrl + "/cartToOrder";

const styles = StyleSheet.create({
    header:{
        justifyContent:"center",
        alignItems: "center",
        backgroundColor: "white",
    },
    itemContainer:{
        marginRight:5,
        height:100,
        flexDirection:"row",
    },
    image:{
        width: 85,
        height: 85,
        resizeMode: 'contain'
    },
    center:{
        justifyContent:"center",
        alignItems: "center",
    },
    title:{
        fontFamily:"Microsoft YaHei",
        fontSize:17,
    },
    description:{
        fontFamily:"Microsoft YaHei",
        color:"rgb(120,120,120)",
        fontSize:12,
    },
    price:{
        fontFamily:"Microsoft YaHei",
        color:"rgb(255,0,0)",
        fontSize: 16
    },
});

class CartScreen extends Component{
    constructor(props) {
        super(props);
        this.listen = null;
        this.state = {
            cartList: [],
            selectedRow: [],
            checked: {},
            quantity: {},
            price:{},
            selectAll: false,
        }
    }

    componentDidMount(){
        if (Platform.OS === 'android') {
            BackHandler.addEventListener("back", this.onBackClicked);
            this.getData();
            this.props.navigation.setParams({getData: ()=>{this.getData();}});
        }
        this.listen = DeviceEventEmitter.addListener("flushCart", (value)=>{this.getData();})
    }

    componentWillUnmount(){
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener("back",this.onBackClicked);
        }
        this.listener.remove();
    }

    getData = () =>{
        let that = this;
        AsyncStorage.getItem("user")
            .then(value =>{
                let userInfo = JSON.parse(JSON.parse(value));
                const callback = (data) =>{
                    let _checked = {};
                    let _quantity = {};
                    let _price = {};
                    for(let i=0;i<data.length;++i){
                        _checked[data[i].id] = false;
                        _quantity[data[i].id] = 1;
                        _price[data[i].id] = data[i].bookInfo.price;
                    }
                    that.setState({cartList:data, checked:_checked,quantity:_quantity, price:_price, selectedRow:[]});
                };
                postRequest(GETCART_URL+"?userId="+userInfo.userId,{},callback);
            })
            .catch(error => console.log(error));
    };

    onBackClicked = () =>{
        let {showTab} = this.props.route.params;
        showTab();
        return false;
    };

    checkOnChange = (event, id) =>{
        let flag = event.target.checked;
        let _selectedRow = [...this.state.selectedRow];
        let _checked = this.state.checked;
        if(flag){
            _selectedRow.push(id);
            _checked[id] = true;
        }
        else{
            _checked[id] = false;
            for(let i=0;i<_selectedRow.length;++i){
                if(_selectedRow[i] === id){
                    _selectedRow.splice(i, 1);
                    break;
                }
            }
        }
        console.log(_selectedRow);
        this.setState({selectedRow:_selectedRow, checked:_checked});

    };

    quantityOnChange = (value, id) =>{
        let _quantity = this.state.quantity;
        _quantity[id] = value;
        console.log(_quantity);
        this.setState({quantity:_quantity});
    };

    addOrder = () =>{
        const callback = (data) =>{
            if(!data.status){
                Toast.success(data.msg, 2);
                this.getData();
            }
            else{
                Toast.fail(data.msg, 2);
            }
        };
        let jsonData = {data:JSON.stringify(this.state.selectedRow)};
        postRequest(SUBORDER_URL, jsonData, callback);
    };

    renderCartItem = ({item}) =>{
        return(
            <>
                <View style={styles.itemContainer}>
                    <View style={{flex:1.2,...styles.center}}>
                        <Checkbox
                            checked={this.state.checked[item.id]}
                            style={{ color: "rgb(150,150,150)" }}
                            onChange={event => this.checkOnChange(event, item.id)}
                        />
                    </View>
                    <View style={{flex:3.1, ...styles.center}}>
                        <Image style={styles.image} source={{uri: item.bookInfo.bookImage.imageBase64}}/>
                    </View>
                    <View style={{flex:7, flexDirection:"column"}}>
                        <View style={{flex:3, flexDirection:"row"}}>
                            <View style={{flex:3, flexDirection:"column"}}>
                                <View style={{flex:1.4, justifyContent:"center"}}>
                                    <Text style={styles.title}>{item.bookInfo.name}</Text>
                                </View>
                                <View style={{flex:2}}>
                                    <Text style={styles.description}
                                          numberOfLines={2}
                                          ellipsizeMode={'tail'}
                                    >
                                        {item.bookInfo.description}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flex:1.1}}>
                                <Text style={styles.price}>￥{item.bookInfo.price}</Text>
                            </View>
                        </View>
                        <View style={{flex:1, alignItems: "flex-end"}}>
                            <Stepper
                                key="1"
                                max={10}
                                min={1}
                                readOnly={false}
                                defaultValue={1}
                                onChange={value => this.quantityOnChange(value, item.id)}
                                style={{width:100}}
                            />
                        </View>
                    </View>
                </View>
                <Divider/>
            </>
        );
    };

    render(){
        let {hideTab} = this.props.route.params;
        hideTab();
        let totalNum = 0;
        let totalPrice = 0.0;
        for(let i=0;i<this.state.selectedRow.length;++i){
            let id = this.state.selectedRow[i];
            totalPrice += this.state.quantity[id]*this.state.price[id];
            totalNum += this.state.quantity[id];
        }
        return(
            <Provider>
                <View style={{flex:1, backgroundColor:"rgb(255,255,255)"}}>
                    <View style={{flex:0.7, ...styles.header}}>
                        <Text>购物车</Text>
                    </View>

                    <View style={{flex:9}}>
                        <View style={{flex:0.8, flexDirection:"row"}}>
                            <View style={{flex:0.5, ...styles.center}}>
                                <Checkbox
                                    checked={false}
                                    style={{ color: "rgb(150,150,150)" }}
                                    onChange={this.checkOnChange}
                                />
                            </View>
                            <View style={{flex:0.6, ...styles.center}}>
                                <Text style={{fontSize:17, fontFamily:"Microsoft YaHei"}}>全选</Text>
                            </View>
                            <View style={{flex:3, ...styles.center}}>

                            </View>
                            <View style={{flex:1, ...styles.center}}>
                                <Text style={{fontSize:17, fontFamily:"Microsoft YaHei", color:"rgb(130,130,130)"}}>
                                    共{totalNum}件
                                </Text>
                            </View>
                        </View>
                        <Divider/>
                        <View style={{flex:9}}>
                            <FlatList
                                data={this.state.cartList}
                                renderItem={this.renderCartItem}
                                keyExtractor={item => item.id}
                            />
                        </View>
                    </View>

                    <View style={{flex:1, flexDirection:"row", backgroundColor:"rgb(240, 240, 240)"}}>
                        <View style={{flex:0.7, flexDirection:"row", ...styles.center}}>
                            <Checkbox
                                checked={false}
                                style={{ color: "rgb(150,150,150)" }}
                                onChange={this.checkOnChange}
                            />
                            <Text style={{fontSize:17, fontFamily:"Microsoft YaHei"}}>全选</Text>
                        </View>
                        <View style={{flex:1.1, flexDirection:"row", ...styles.center}}>
                            <Text style={{fontSize:17, fontFamily:"Microsoft YaHei"}}>合计：</Text>
                            <Text style={{fontSize:17, fontFamily:"Microsoft YaHei", color:"rgb(255,0,0)"}}>￥{totalPrice.toFixed(2)}</Text>
                        </View>
                        <View style={{flex:1, backgroundColor:"rgb(238,10,36)"}}>
                            <TouchableHighlight style={{flex:1, ...styles.center}} onPress={this.addOrder}>
                                <Text style={{fontFamily:"Microsoft YaHei", fontSize:17, color:"white"}}>提交订单</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Provider>

        );
    }
}

export default CartScreen;
