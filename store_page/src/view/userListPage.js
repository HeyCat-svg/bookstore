import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {
    Button, Layout, Card, Drawer, Row, Col,
    Typography, Input, Popconfirm, Divider, DatePicker, message
} from 'antd';
import NavBar from "../component/navBar";
import Footers from "../component/footer";
import {postRequest} from "../utils/ajax";
import {history} from "../utils/history";
import "../bootstrap/orders.css"
import '../bootstrap/css/bootstrap.min.css';
import 'antd/dist/antd.css';

const { Header, Footer, Sider, Content } = Layout;
const { Title, Text } = Typography;

class UserListPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
        }
    }

    componentDidMount(){
        this.getUserList();
    }

    getUserList = () =>{
        let userInfo = JSON.parse(localStorage.getItem("user"));
        if(parseInt(userInfo.userType) === 1){
            const callback = (data) =>{
                for(let i = 0; i < data.length; ++i){
                    if(parseInt(data[i].userType) === 1){   // admin
                        data.splice(i, 1);
                        i--;
                    }
                }
                this.setState({userList: data});
            };
            postRequest("http://localhost:8080/getUsers", {}, callback);
        }
    };

    renderUser = (user) =>{
        const cardStyle = {
            marginBottom:10,
        };
        const font = {
            fontSize: 17,
        };
        return(
            <Card style={cardStyle}>
                <Row style={{marginLeft:10}}>
                    <Col span={2}>
                        <Text style={font}>Username:</Text>
                    </Col>
                    <Col span={16}>
                        <Text style={font}>{user.username}</Text>
                    </Col>
                    <Col span={6}>
                        <Button onClick={()=>(this.dealUser(user))}>
                            {(parseInt(user.userType) === 403)?("解封"):("封禁")}
                        </Button>
                    </Col>
                </Row>
            </Card>
        );
    };

    dealUser = (user) =>{
        console.log(user);
        let userType = user.userType;
        const callback = (data) =>{
            if(data.status === 0){
                message.success(data.msg);
                this.getUserList();
            }
            else{
                message.error(data.msg);
            }
        };
        if(parseInt(userType) === 403){
            postRequest("http://localhost:8080/unblock?userId="+user.userId, {}, callback);
        }
        else{
            postRequest("http://localhost:8080/ban?userId="+user.userId, {}, callback);
        }
    };

    render(){
        const userList = this.state.userList.map(item => (this.renderUser(item)));
        console.log(userList);
        const style = {
            backgroundColor: "rgba(255,255,255,0)",
            height:"auto",
            padding:"0px",
            lineHeight:"30px",
        };
        const userListStyle = {
            width:1100,
            marginLeft:450,
        };
        return(
            <div>
                <Layout style={style}>
                    <Header style={style}>
                        <NavBar/>
                    </Header>
                    <Content style={{...style, minHeight:838}}>
                        <div style={userListStyle}>
                            <Row>
                                <Col span={24}>
                                    <Title level={1}>User List</Title>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    {userList}
                                </Col>
                            </Row>
                        </div>
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

export default withRouter(UserListPage);
