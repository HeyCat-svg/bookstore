import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Layout, Typography} from "antd";
import NavBar from "../component/navBar";
import Footers from "../component/footer";
import Orders from "../component/orders";
import 'antd/dist/antd.css';

const { Header, Footer, Sider, Content } = Layout;

class OrderPage extends Component{
    render(){
        const style = {
            backgroundColor: "rgba(255,255,255,0)",
            height:"auto",
            padding:"0px",
            lineHeight:"30px",
        };
        return(
            <div className="orderPage">
                <Layout style={style}>
                    <Header style={style}>
                        <NavBar/>
                    </Header>
                    <Content style={{...style, minHeight:838}}>
                        <Orders/>
                    </Content>
                    <Footer style={style}>
                        <div style={{textAlign:'center'}}>
                            <Footers style={{textAlign:'center'}}/>
                        </div>
                    </Footer>
                </Layout>
            </div>
        );
    }
}

export default withRouter(OrderPage);
