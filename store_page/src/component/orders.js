import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Button, Layout, Card, Drawer, Row, Col,
    Typography, Input, Popconfirm, Divider,  DatePicker} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import {postRequest} from "../utils/ajax";
import "../bootstrap/orders.css"
import '../bootstrap/css/bootstrap.min.css';
import 'antd/dist/antd.css';

const { Search } = Input;
const {Text, Title, Paragraph} = Typography;
const { RangePicker } = DatePicker;

class Orders extends Component{
    constructor(props) {
        super(props);
        this.state={
            searchText:"",
            preSearchData:[],
            orderList:[],
            userList:[],
            curUser:0,
            admin:false,
            preBtn:true,
            nextBtn:false,
        };
    }

    componentDidMount() {
        let userInfo = JSON.parse(localStorage.getItem("user"));
        if(parseInt(userInfo.userType) === 1){  // admin
            const callback = (data) => {
                for(let i = 0; i < data.length; ++i){
                    if(parseInt(data[i].userType) === 1){   // admin
                        data.splice(i, 1);
                        i--;
                    }
                }
                this.getOrders(data[0].userId);
                if(data.length === 1){
                    this.setState({admin:true, userList:data, curUser:0, nextBtn:true});
                }
                else{
                    this.setState({admin:true, userList:data, curUser:0});
                }

            };
            postRequest("http://localhost:8080/getUsers", {}, callback);
        }
        else{
            this.getOrders(userInfo.userId);
        }
    }

    getOrders = (userId) =>{
        const callback = (data) =>{
            // console.log(data);
            this.setState({preSearchData:data, orderList:data});
        };
        postRequest("http://localhost:8080/getOrders?userId="+userId,{}, callback);
    };

    onSearch = (value) =>{
      console.log(value);
      // copy array
      let _preSearchData = JSON.parse(JSON.stringify(this.state.preSearchData));
      if(value === ""){
          this.setState({orderList:_preSearchData});
      }
      else{
          let pattern = new RegExp(value, "i");
          for(let i = 0;i<_preSearchData.length;++i){
              for(let j = 0;j<_preSearchData[i].orderItems.length;++j){
                  if(!pattern.test(_preSearchData[i].orderItems[j].bookInfo.name.toString())){
                      _preSearchData[i].orderItems.splice(j, 1);
                      j--;
                  }
              }
              if(_preSearchData[i].orderItems.length === 0){
                  _preSearchData.splice(i, 1);
                  i--;
              }
          }
          this.setState({orderList:_preSearchData});
      }
    };

    dateOnChange = (dates, dateString) =>{
        console.log(dates, dateString);
        let dateStart = Date.parse(dateString[0]);
        let dateEnd = Date.parse(dateString[1]);
        let _preSearchData = JSON.parse(JSON.stringify(this.state.preSearchData));
        if(dateString[0] === "" && dateString[1] === ""){
            this.setState({orderList:_preSearchData});
        }
        else{
            for(let i=0;i<_preSearchData.length;++i){
                let date = Date.parse(_preSearchData[i].time.substr(0,10));
                if(date<dateStart || date>dateEnd){
                    _preSearchData.splice(i, 1);
                    i--;
                }
            }
            this.setState({orderList:_preSearchData});
        }
    };

    deleteConfirm = (orderId) =>{
        console.log(orderId);
    };

    preUser = () =>{
        let _curUser = this.state.curUser - 1;
        if(_curUser === 0){
            this.setState({preBtn:true, nextBtn:false, curUser:_curUser});
        }
        else{
            this.setState({nextBtn:false, curUser:_curUser});
        }
        setTimeout(()=>{
            this.getOrders(this.state.userList[_curUser].userId);
        }, 500);
    };

    nextUser = () =>{
        let _curUser = this.state.curUser + 1;
        if(_curUser === this.state.userList.length-1){
            this.setState({preBtn:false, nextBtn:true, curUser:_curUser});
        }
        else{
            this.setState({preBtn:false, curUser:_curUser});
        }
        setTimeout(()=>{
            this.getOrders(this.state.userList[_curUser].userId);
        }, 500);
    };

    renderOrderLine = (item) =>{
        const cardStyle={
            marginBottom:10,
        };
        const renderItems = (item) =>{
            let items = [];
            const imgStyle = {
                width:"100px",
                height:"100px",
                marginLeft:"30px",
            };
            for(let i=0; i < item.orderItems.length; ++i){
                let bookImage = (item.orderItems[i].bookInfo.bookImage==null)?(item.orderItems[i].bookInfo.image):(item.orderItems[i].bookInfo.bookImage.imageBase64);
                items.push(
                    <Row>
                        <Col span={4}>
                            <img src={bookImage} alt="book image" style={imgStyle}/>
                        </Col>
                        <Col span={8}>
                            <Row>
                                <Col span={24}>
                                    <Text className="title">{item.orderItems[i].bookInfo.name}</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Text className="author">{item.orderItems[i].bookInfo.author}</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Paragraph className="description" ellipsis={{rows: 2, expandable: false}}>
                                        {item.orderItems[i].bookInfo.description}
                                    </Paragraph>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={4} style={{textAlign:"center"}}>
                            <Text className="font">￥{item.orderItems[i].bookInfo.price}</Text>
                        </Col>
                        <Col span={4} style={{textAlign:"center"}}>
                            <Text className="font">{item.orderItems[i].quantity}</Text>
                        </Col>
                        <Col span={4} style={{textAlign:"center"}}>
                            <Text className="font">
                                ￥{(item.orderItems[i].quantity*item.orderItems[i].bookInfo.price).toFixed(2)}
                            </Text>
                        </Col>
                    </Row>
                );
                if(i !== item.orderItems.length - 1){
                    items.push(
                        <Divider/>
                    );
                }
            }
            return items;
        };
        return(
            <div className="orderItem">
                <Card style={cardStyle}>
                    <div className="header">
                        <Row>
                            <Col span={22}>
                                <Text className="header">{item.time}</Text>
                                &nbsp;
                                <Text className="header">订单号：{item.orderId}</Text>
                            </Col>
                            <Col span={2}>
                                <Popconfirm
                                    title="Are you sure delete this order?"
                                    onConfirm={()=>this.deleteConfirm(item.orderId)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <DeleteOutlined style={{fontSize:20}}/>
                                </Popconfirm>
                            </Col>
                        </Row>
                    </div>

                    {renderItems(item)}
                </Card>
            </div>
        );
    };

    render(){
        const data = this.state.orderList.map(item => (this.renderOrderLine(item)));
        return(
            <div className="orders">
                <Row>
                    <Col span={12}>
                        <Search
                            placeholder="输入书名进行搜索"
                            onSearch={this.onSearch}
                            style={{ width: 300, marginBottom:10 }}
                        />
                    </Col>
                    <Col span={12} style={{textAlign:"right"}}>
                        {(this.state.admin)?(
                            <>
                                <Text className="hintWord">
                                    当前用户：{this.state.userList[this.state.curUser].username}
                                </Text>
                                <Button disabled={this.state.preBtn} onClick={this.preUser} style={{marginRight:10}}>上一个</Button>
                                <Button disabled={this.state.nextBtn} onClick={this.nextUser} style={{marginRight:10}}>下一个</Button>
                            </>
                        ):(
                            <>
                            </>
                        )}
                    </Col>
                </Row>
                <div className="header" style={{height:40}}>
                    <Row>
                        <Col span={12} style={{textAlign:"center"}}>
                            <Text>商品</Text>
                        </Col>
                        <Col span={4} style={{textAlign:"center"}}>
                            <Text>单价</Text>
                        </Col>
                        <Col span={4} style={{textAlign:"center"}}>
                            <Text>数量</Text>
                        </Col>
                        <Col span={4} style={{textAlign:"center"}}>
                            <Text>实付款</Text>
                        </Col>
                    </Row>
                </div>
                <div style={{marginBottom:5, textAlign:"right"}}>
                    <Text className="hintWord">按照日期筛选：</Text>
                    <RangePicker onChange={this.dateOnChange}/>
                </div>
                <Row>
                    <Col span={24}>
                        {data}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Orders;
