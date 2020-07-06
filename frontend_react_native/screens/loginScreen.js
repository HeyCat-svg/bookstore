import React, {Component} from 'react';
import {Text,View, Button, TextInput, Dimensions, StyleSheet, TouchableHighlight} from 'react-native';
import {login} from '../services/userService';
import {postRequest} from '../utils/fetch';
import {_storeData} from '../utils/localStorage';
import {Provider, Toast} from '@ant-design/react-native';
import {apiUrl} from '../urlconfig';

const LOGIN_URL = apiUrl+"/login";
const {width,height} = Dimensions.get('window');
const styles = StyleSheet.create({
    center:{
        justifyContent: "center",
        alignItems:'center',
    },
    container: {
        flex: 1,
        // 侧轴的对齐方式
        justifyContent: "center",
        alignItems:'center',
        backgroundColor: 'rgb(255,243,232)'
    },
    textInputStyle: {
        width:width*0.9,
        height:40,
        backgroundColor:'white',
        textAlign:'center',
        marginBottom:5,
        borderColor:"rgb(200,150,150)",
        borderWidth:1,
    },
    loginBtnStyle: {
        width: width*0.9,
        height: 40,
        backgroundColor:'rgb(235, 149, 150)',
        marginTop:20,
        marginBottom: 20,
        borderRadius:5
    },
    settingStyle: {
        width: width*0.85,
        height: 40,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    titleStyle: {
        fontSize:40,
        alignItems:'center',
        marginBottom:30,
        fontFamily:"Microsoft YaHei",
        color:"rgb(217,105,089)"
    },
});

class LoginScreen extends Component{
    constructor(props) {
        super(props);
        this.state={
            username:"",
            password:"",
            hintString:"",
        }
    }

    onLogin = () =>{
        // var {toHomePage} = this.props.route.params;
        let data = {
            "username": this.state.username,
            "password": this.state.password,
        };
        login(data, this.props.navigation,(string)=>{this.setState({hintString:string})});
    };

    render(){
        return(
            <Provider>
                <View style={{flex:1}}>
                    <View style={styles.container}>
                        <Text style={styles.titleStyle}>
                            Bookstore
                        </Text>
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={text => this.setState({username:text})}
                            value={this.state.username}
                            placeholder={'请输入用户名'}
                        />
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={text => this.setState({password:text})}
                            value={this.state.password}
                            secureTextEntry={true}
                            placeholder={'请输入密码'}
                        />
                        <Text style={{color:"red"}}>{this.state.hintString}</Text>
                        <View style={styles.loginBtnStyle}>
                            <TouchableHighlight onPress={() => {this.onLogin()}} style={{flex:1,...styles.center}}>
                                <Text style={{fontSize: 18, fontFamily:"Microsoft YaHei",color:"white"}}> 登陆</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Provider>
        );
    }
}

export default LoginScreen;
