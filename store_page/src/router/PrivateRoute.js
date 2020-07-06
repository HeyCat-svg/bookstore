import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom'
import * as userService from "../services/userService"
import {message} from "antd";

class PrivateRoute extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            hasAuthed: false,
        };
    }

    checkAuth = (data) => {
        console.log(data);
        if (!data.status) {
            this.setState({isAuthed: true, hasAuthed: true});
        } else {
            message.error(data.msg);
            localStorage.removeItem('user');
            this.setState({isAuthed: false, hasAuthed: true});
        }
    };

    componentDidMount() {
        userService.checkSession(this.checkAuth);
    }


    render() {
        let {needAuth} = this.props;
        let userInfo = JSON.parse(localStorage.getItem("user"));
        let userAuth = 0;
        if(userInfo != null){
            userAuth = userInfo.userType;
        }
        let canAccess = (needAuth) ? (userAuth || null) : (true);
        const {component: Component, path="/",exact=false,strict=false} = this.props;

        console.log({isAuthed:this.state.isAuthed, hasAuthed:this.state.hasAuthed, path:path});

        if (!this.state.hasAuthed) {
            return null;
        }

        return <Route path={path} exact={exact} strict={strict} render={props => (
            this.state.isAuthed ? (
                (canAccess)?
                    (<Component {...props}/>):
                    (<Redirect to={{
                        pathname: '/forbidden',
                        state: {from: props.location}
                    }}/>)
            ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: {from: props.location}
                }}/>
            )
        )}/>
    }
}

export default PrivateRoute;
