import {postRequest} from '../utils/fetch';
import {Toast} from '@ant-design/react-native';
import {apiUrl} from '../urlconfig';
import {_removeData, _storeData} from '../utils/localStorage';
import * as Alert from 'react-native';

const LOGIN_URL = apiUrl + "/login";
const LOGOUT_URL = apiUrl + "/logout";
const CHECK_URL = apiUrl + "/checkSession";

const login = (data, navigation, callbackFun) => {
    const url = LOGIN_URL;
    const callback = (data) => {
        console.log(data);
        if(!data.status){
            _storeData("user",JSON.stringify(data.data));
            Toast.success(data.msg, 1.5);
            callbackFun("");
            navigation.push("HomeScreen");
        }
        else{
            callbackFun("用户名或者密码错误");
        }
    };
    postRequest(url, data, callback);
};

const logout = (navigation) => {
    const url = LOGOUT_URL;
    const callback = (data) =>{
        console.log(data);
        if(!data.status){
            _removeData("user");
            navigation.push("LoginScreen", {});
            Toast.success(data.msg, 1.5);
        }
        else{
            Toast.fail(data.msg, 1.5);
        }
    };
    postRequest(url,{},callback);
};

const checkSession = (callback) => {
    postRequest(CHECK_URL, {}, callback);
};

export {login, logout, checkSession};
