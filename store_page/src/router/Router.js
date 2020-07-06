import React, {Component}from 'react';
import { Router, Route, Switch, Redirect} from 'react-router-dom';
import PrivateRoute from './PrivateRoute'
import LoginRoute from  './LoginRoute'
import MainPage from "../view/mainPage";
import LoginPage from '../view/loginPage'
import Admin from "../view/admin";
import CartPage from "../view/cartPage";
import OrderComplete from "../view/orderComplete";
import {history} from "../utils/history";
import OrderPage from "../view/orderPage";
import UserListPage from "../view/userListPage";
import ForbiddenPage from "../view/forbiddenPage";
import StatisticsPage from "../view/statisticsPage";




class BasicRoute extends Component{
    constructor(props) {
        super(props);
        history.listen((location, action) => {
            // clear alert on location change
            console.log(location,action);
        });
    }

    render(){
        return(
            <Router history={history}>
                <Switch>
                    <PrivateRoute exact path="/" component={MainPage} needAuth={false}/>
                    <LoginRoute exact path="/login" component={LoginPage} />
                    <PrivateRoute exact path="/admin" component={Admin} needAuth={true}/>
                    <PrivateRoute exact path="/cartPage" component={CartPage} needAuth={false}/>
                    <PrivateRoute exact path="/orders" component={OrderPage} needAuth={false}/>
                    <PrivateRoute exact path="/orderComplete" component={OrderComplete} needAuth={false}/>
                    <PrivateRoute exact path="/statistics" component={StatisticsPage} needAuth={false}/>
                    <PrivateRoute exact path="/userList" component={UserListPage} needAuth={true}/>
                    <PrivateRoute exact path="/forbidden" component={ForbiddenPage} needAuth={false}/>
                    <Redirect from="/*" to="/" />
                </Switch>
            </Router>
        )
    }


}

export default BasicRoute;
