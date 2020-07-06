import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {
    Form, Input, Button, Checkbox, Drawer, Col, Row,
    InputNumber, Tooltip, Cascader, AutoComplete, Select, Layout,
    Typography, message, notification
} from "antd";
import {UserOutlined, LockOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {login} from "../services/userService";
import {postRequest} from "../utils/ajax";
import Footers from "../component/footer";
import '../bootstrap/login.css';
import 'antd/dist/antd.css';


const AutoCompleteOption = AutoComplete.Option;
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

class LoginPage extends Component{

    render() {
        const style1 = {
            textAlign:'center',
        };
        const style2 = {
            backgroundColor: "rgba(255,255,255,0)",
            height:"auto",
            padding:"0px",
            lineHeight:"30px",
        };
        return(
            <div id="login">
                <Layout style={style2}>
                    <Content style={{...style2, minHeight:910}}>
                        <div id="loginForm_container">
                            <Title level={2} style={{marginBottom:30}}>BookStore</Title>
                            <LoginForm/>
                        </div>
                    </Content>
                    <Footer style={style2}>
                        <div style={style1}>
                            <Footers style={style1}/>
                        </div>
                    </Footer>
                </Layout>
            </div>
        );
    }
}

class LoginForm extends Component{
    constructor(props) {
        super(props);
        this.registerForm = React.createRef();
        this.loginForm = React.createRef();
        this.state = {
            visible: false,
            userList:[],
            _help:"",
            validateStatus:""
        }
    }

    componentDidMount() {
        const callback = (data) =>{
            this.setState({userList:data});
        };
        postRequest("http://localhost:8080/getUsers", {}, callback);
    }

    onFinish = values => {
        console.log('Received values of form: ', values);
        login(values);
    };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };


    onSubmit = () =>{
        let formInfo = this.registerForm.current.getFieldValue();
        console.log(formInfo);
        // console.log(this.state.userList);

        let flag = true;
        let pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        for(let key in formInfo){
            if(formInfo[key]==null){
                flag = false;
                break;
            }
        }
        if(formInfo.confirm!==formInfo.password){
            flag = false;
        }
        for(let i = 0; i < this.state.userList.length; ++i){
            if(formInfo["username"].toString() === this.state.userList[i].username.toString()){
                this.setState({_help:"用户名已被使用", validateStatus:"error"});
                flag = false;
                break;
            }
        }
        if(!pattern.test(formInfo["email"].toString())){
            flag = false;
        }

        if(flag){
            const callback = (data) =>{
                if(data.status === 0){
                    message.success(data.msg);
                }
                else{
                    message.error(data.msg);
                }
            };
            postRequest("http://localhost:8080/register", formInfo, callback);
            this.registerForm.current.resetFields();
            this.setState({visible:false, _help:"", validateStatus:""});
        }
        // else{
        //     notification.open({
        //         message: 'Wrong Format!',
        //         description:
        //             'Please enter information with correct format.',
        //         duration: 3,
        //         // onClick: () => {
        //         //     console.log('Notification Clicked!');
        //         // },
        //     });
        // }
    };

    render(){

        const formItemLayout = {
            labelCol: {xs: { span: 24 }, sm: { span: 8 },},
            wrapperCol: {xs: { span: 24 }, sm: { span: 16 },},
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {span: 24, offset: 0,},
                sm: {span: 16, offset: 8,},
            },
        };
        const prefixSelector = (
            <Form.Item name="prefix" noStyle>
                <Select style={{ width: 70 }}>
                    <Option value="86">+86</Option>
                    <Option value="87">+87</Option>
                </Select>
            </Form.Item>
        );

        return (
            <div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true,}}
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{required: true, message: 'Please input your Username!',},]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please input your Password!',},]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="">Forgot password</a>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <Button type="link" onClick={this.showDrawer}>register now!</Button>
                    </Form.Item>
                </Form>

                <Drawer
                    title="Create a new account"
                    width={720}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={<div style={{textAlign: 'right',}}>
                            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button onClick={this.onSubmit} type="primary">
                                Submit
                            </Button>
                        </div>
                    }
                >
                    <Form
                        {...formItemLayout}
                        name="register"
                        ref={this.registerForm}
                    >
                        <Form.Item
                            name="username"
                            label="Username"
                            hasFeedback
                            help={this.state._help}
                            validateStatus={this.state.validateStatus}
                            rules={[{required: true, message: 'Please input your username!',}]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[{type: 'email', message: 'The input is not valid E-mail!',},
                                        {required: true, message: 'Please input your E-mail!',},]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{required: true, message: 'Please input your password!',},]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[{required: true, message: 'Please confirm your password!',},
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('The two passwords that you entered do not match!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="nickname"
                            label={
                                <span>Nickname&nbsp;
                                    <Tooltip title="What do you want others to call you?">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </span>
                            }
                            rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[{ required: true, message: 'Please input your phone number!' }]}
                        >
                            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item name="address"
                                   label="Address"
                                   rules={[{ required: true, message: 'Please enter address'}]}
                        >
                            <Input style={{ width: '100%' }}/>
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
        );
    }

}

export default  withRouter(LoginPage);
