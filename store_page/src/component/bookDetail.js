import React, {Component} from "react";
import {Layout, Row, Col, Typography, Button, InputNumber, message} from "antd";
import { ShoppingCartOutlined } from '@ant-design/icons';
import {postRequest} from "../utils/ajax";
import 'antd/dist/antd.css';

const { Title, Text } = Typography;

class BookDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {quantity:1,};
    }

    onChange = (value) =>{
        this.setState(()=>({quantity:value}));
    };

    addCart = () => {
        let user = JSON.parse(localStorage.getItem("user"));
        let cartInfo = {
            userId:user.userId,
            bookId: this.props.bookId,
            quantity: this.state.quantity,
        };
        const callback = (data) =>{
            if(!data.status){
                message.success(data.msg);
            }
            else{
                message.error(data.msg);
            }
        };
        // console.log(cartInfo);
        postRequest("http://localhost:8080/addCart", cartInfo, callback);
        this.props.trigger();
    };

    render() {
        const imgStyle = {height:"350px", width:"350px"};
        const colStyle = {margin:"7px"};
        const offsetStyle = {margin:"15px",position:"relative",top:"100px",left:"10px"};
        return (
            <div>
                <Row>
                    <Col span={6}>
                        <img src = {this.props.image} alt="sample" style={imgStyle}/>
                    </Col>
                    <Col span={12}>
                        <Row>
                            <Col span={24} style={colStyle}>
                                <Title level={3}>{this.props.name}</Title>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={colStyle}>
                                <Text>
                                    <strong style={{fontSize:"16px"}}>Author:&emsp;</strong>
                                    {this.props.author}
                                </Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={colStyle}>
                                <Text>
                                    <strong style={{fontSize:"16px"}}>Type:&emsp;</strong>
                                    {this.props.type}</Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={colStyle}>
                                <Text>
                                    <strong style={{fontSize:"16px"}}>ISBN:&emsp;</strong>
                                    {this.props.isbn}
                                    </Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={colStyle}>
                                <Text>
                                    <strong style={{fontSize:"16px"}}>Price:&emsp;</strong>
                                    <span style={{color:"rgba(255,0,0,1)",fontSize:"20px"}}>
                                        {"¥"+this.props.price}
                                    </span>
                                </Text>
                            </Col>
                        </Row>
                        <Row style={{width:"90%"}}>
                            <Col span={24} style={colStyle}>
                                <Text><strong>Description:&emsp;</strong>{this.props.description}</Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6} >
                        <Row span={24} style={{...colStyle, ...offsetStyle}}>
                            <Col span={24}>
                                <InputNumber min={1} max={this.props.inventory} defaultValue={1} onChange={this.onChange} />
                                <Text style={{marginLeft:"20px"}}><strong>Inventory:&emsp;</strong>{this.props.inventory}</Text>
                            </Col>
                        </Row>
                        <Row span={24} style={{...colStyle, ...offsetStyle}}>
                            <Col span={24}>
                                <Title level={4}>
                                    Sum:&emsp;{this.state.quantity*this.props.price}
                                </Title>
                            </Col>
                        </Row>
                        <Row span={24} span={24} style={{...colStyle, ...offsetStyle}}>
                            <Col span={24}>
                                <Button type="primary" onClick={this.addCart}>
                                    <ShoppingCartOutlined />Add to Cart
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default BookDetail;