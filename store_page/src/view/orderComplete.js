import React,{Component, } from 'react';
import {withRouter} from "react-router-dom";
import {Layout, Typography} from "antd";
import Complete from "../component/complete";
import NavBar from "../component/navBar";
import Footers from "../component/footer";
import 'antd/dist/antd.css';
import '../bootstrap/orderComplete.css'

const { Header, Footer, Sider, Content } = Layout;

class OrderComplete extends Component{
    render(){
        const style = {
            backgroundColor: "rgba(255,255,255,0)",
            height:"auto",
            padding:"0px",
            lineHeight:"30px",
        };
        return(
            <div className="orderComplete">
                <Layout style={style}>
                    <Header style={style}>
                        <NavBar/>
                    </Header>
                    <Content style={{...style, minHeight:838}}>
                        <Complete/>
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

export default withRouter(OrderComplete);