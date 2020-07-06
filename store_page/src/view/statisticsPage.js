import React,{Component} from "react";
import {withRouter} from "react-router-dom";
import {Layout, Typography} from "antd";
import NavBar from "../component/navBar";
import Footers from "../component/footer";
import Statistics from "../component/statistics";

const { Header, Footer, Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

class StatisticsPage extends Component{
    render(){
        const style = {
            backgroundColor: "rgba(255,255,255,0)",
            height:"auto",
            padding:"0px",
            lineHeight:"30px",
        };
        return(
            <div>
                <Layout style={style}>
                    <Header style={style}>
                        <NavBar/>
                    </Header>
                    <Content style={{...style, minHeight:838, width:1100, marginLeft:360}}>
                        <Typography>
                            <Title>Statistics</Title>
                        </Typography>
                        <Statistics/>
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

export default withRouter(StatisticsPage);
