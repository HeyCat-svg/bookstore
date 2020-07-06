import React,{Component} from 'react';
import {checkSession} from "../services/userService";
import {Button} from "antd";

class Test extends Component{
    constructor(props) {
        super(props);
    }
    callback = (data) =>{
        console.log(data);
    };
    fun = () =>{
        checkSession(this.callback);
    };
    render() {
        return (
            <div>
                <Button type="primary" onClick={this.fun}>
                    TEST
                </Button>
            </div>
        );
    }
}

export default Test;