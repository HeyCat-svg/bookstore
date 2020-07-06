import React,{Component} from 'react';
import { BrowserRouter as Router,Route} from 'react-router-dom';
import MainPage from './view/mainPage'
import CartPage from "./view/cartPage";
import Admin from "./view/admin";
import LoginPage from "./view/loginPage";
import BasicRoute from "./router/Router";

import Test from "./component/Test";

class App extends Component{
  render(){
    return (
        // <Test/>
        <BasicRoute/>
    );
  }
}



export default App;
