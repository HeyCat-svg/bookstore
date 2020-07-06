import {postRequest} from "../utils/ajax";
import {history} from "../utils/history";
import {message} from "antd";

const login = (data) => {
    const url = "http://localhost:8080/login";
    const callback = (data) => {
        console.log(data);
        if(!data.status){
            localStorage.setItem("user", JSON.stringify(data.data));
            history.push("/");
            message.success(data.msg);
        }
        else{
            message.error(data.msg);
        }
    };
    postRequest(url, data, callback);
};

const logout = () => {
    const url = "http://localhost:8080/logout";
    const callback = (data) =>{
        console.log(data);
        if(!data.status){
            localStorage.removeItem("user");
            history.push("/login");
            message.success(data.msg);
        }
        else{
            message.error(data.msg);
        }
    };
    postRequest(url,{},callback);
};

const checkSession = (callback) => {
    const url = "http://localhost:8080/checkSession";
    postRequest(url, {}, callback);
};

export {login, logout, checkSession};