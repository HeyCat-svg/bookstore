import React, {Component} from 'react'
import { Result, Button, Typography, Divider } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import {history} from "../utils/history";
import {postRequest} from "../utils/ajax";

const { Paragraph, Text } = Typography;

class Complete extends Component{
    constructor(props) {
        super(props);
        this.user = JSON.parse(localStorage.getItem("user"));
        this.state = {
            data:[],
        }
    }

    componentDidMount() {
        postRequest("http://localhost:8080/getOrders?userId="+this.user.userId,{},
            (data)=>{console.log(data); this.setState({data:data});});
    }

    toMainPage = () =>{
        history.push("/");
    };

    toCartPage = () =>{
        history.push("/cartPage");
    };


    renderItem(){
        let orders = this.state.data;
        let items = [];
        for(let i=0; i<orders.length;++i){
            for(let j = 0; j < orders[i].orderItems.length; ++j){
                items.push(
                    <Paragraph>
                        <RightOutlined />
                        {"OrderId: "+orders[i].orderId+"\t"+orders[i].orderItems[j].bookInfo.name+"\t"+orders[i].orderItems[j].quantity+"\t"+orders[i].time}
                    </Paragraph>
                );
            }
            items.push(<Divider />);
        }
        return items;
    }

    render(){
        return(
            <Result
                status="success"
                title="Successfully Purchased Books!"
                subTitle={"UserId:"+this.user["userId"]+" Username:"+this.user["username"]}
                extra={[
                    <Button type="primary" key="console" onClick={this.toMainPage}>
                        Back to main page
                    </Button>,
                    <Button key="buy" onClick={this.toCartPage}>
                        Buy Again
                    </Button>,
                ]}
            >
                <div className="desc" style={{width:1000}}>
                    <Paragraph>
                        <Text strong style={{fontSize: 16,}}>
                            Items that you have bought:
                        </Text>
                    </Paragraph>
                    {this.renderItem()}
                </div>
            </Result>
        );
    }
}

export default Complete;