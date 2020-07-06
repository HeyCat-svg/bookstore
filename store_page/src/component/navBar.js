import React,{Component} from "react";
import {Avatar, Button, Dropdown, Menu, message} from "antd";
import {ShoppingCartOutlined} from "@ant-design/icons";
import {logout} from "../services/userService";
import '../bootstrap/css/bootstrap.min.css';
import '../bootstrap/bookshop.css';
import 'antd/dist/antd.css';


class NavBar extends Component{
    constructor(props) {
        super(props);
        this.user = JSON.parse(localStorage.getItem("user"));
        // console.log(this.user);
    }
    render(){
        return(
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#"> <a href="/" style={{color:"rgba(22,22,22,0.9)"}}>BookStore</a></a>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <Button style={{marginTop:'8px',marginRight:'7px'}}>
                                    <ShoppingCartOutlined />
                                    <a href="/cartPage" style={{color:"rgba(22,22,22,0.9)"}}>My Cart</a>
                                </Button>
                            </li>
                            <li>
                                <Drop username={this.user["username"]}/>
                            </li>
                        </ul>
                        <Search callbackFun={this.props.callbackFun} searchText={this.props.searchText}/>
                    </div>
                </div>
            </nav>
        );
    }
}

class Drop extends Component{
    menu = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="">
                    My Account
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="">
                    Browse History
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="">
                    Message
                </a>
            </Menu.Item>
            <Menu.Item>
                <Button type="link" onClick={logout}>
                    Logout
                </Button>
            </Menu.Item>
        </Menu>
    );

    render(){
        const userInfo = JSON.parse(localStorage.getItem("user"));
        return(
            <div>
                <Dropdown overlay={this.menu} placement="bottomLeft">
                    <Button style={{marginTop:'8px'}}>
                        <a href="/admin" style={{color:"rgba(22,22,22,0.9)"}}>
                            {this.props.username}
                        </a>
                    </Button>
                </Dropdown>
                <Avatar src={(userInfo.user.userIcon === null)?("http://xxx"):(userInfo.user.userIcon.iconBase64)}
                        size="large"
                        shape="square"
                        style={{marginLeft:8, cursor:"pointer"}}
                />
            </div>

        );
    }
}

class Search extends Component{
    handleChange = (e) =>{
        this.searchText=e.target.value;
        this.props.callbackFun(this.searchText);
    };

    render(){
        return(
            <form className="navbar-form navbar-left">
                <div className="form-group">
                    <input type="text" className="form-control"
                           value={this.props.searchText} placeholder="Search"
                           ref="searchBar" onChange={this.handleChange}/>
                </div>
                <button type="submit" className="btn btn-default">Search</button>
            </form>
        );
    }
}

export default NavBar;
