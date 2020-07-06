import React,{Component} from "react";
import {Card, Row, Col, DatePicker, Typography, Button} from "antd";
import {postRequest} from "../utils/ajax";
import "../bootstrap/statistics.css";

const { RangePicker } = DatePicker;
const {Text, Title, Paragraph} = Typography;


class Statistics extends Component{
    constructor(props) {
        super(props);
        this.state={
            admin: false,
            preSearchData: [],
            orderData: [],
            userList: [],
            bookStatistics: true,
            title:"",
        }
    }

    componentDidMount() {
        let userInfo = JSON.parse(localStorage.getItem("user"));
        let _admin = parseInt(userInfo.userType);
        if(_admin === 1){
            const callback = (data) =>{
                this.setState({preSearchData:data, userList:data, admin:true, title:"图书销量榜"});
            };
            postRequest("http://localhost:8080/getUsers",{},callback);
        }
        else{
            const callback = (data) =>{
                this.setState({preSearchData:data, orderData:data, title:"图书购买情况"});
            };
            postRequest("http://localhost:8080/getOrders?userId="+userInfo.userId,{},callback);
        }
    }

    dateOnChange = (dates, dateString) =>{
        console.log(dates, dateString);
        let dateStart = Date.parse(dateString[0]);
        let dateEnd = Date.parse(dateString[1]);
        let _preSearchData = JSON.parse(JSON.stringify(this.state.preSearchData));
        if(dateString[0] === "" && dateString[1] === ""){
            if(this.state.admin){
                this.setState({userList: _preSearchData});
            }
            else{
                this.setState({orderData:_preSearchData});
            }
        }
        else{
            if(this.state.admin){
                for(let i=0;i<_preSearchData.length;++i){
                    for(let j=0;j<_preSearchData[i].user.orders.length;++j){
                        let date = Date.parse(_preSearchData[i].user.orders[j].time);
                        if(date<dateStart || date>dateEnd){
                            _preSearchData[i].user.orders.splice(j, 1);
                            j--;
                        }
                    }
                }
                this.setState({userList:_preSearchData});
            }
            else{
                for(let i=0;i<_preSearchData.length;++i){
                    let date = Date.parse(_preSearchData[i].time.substr(0,10));
                    if(date<dateStart || date>dateEnd){
                        _preSearchData.splice(i, 1);
                        i--;
                    }
                }
                this.setState({orderData:_preSearchData});
            }
        }
    };

    renderUserStatistics = () =>{
        let _orderData = this.state.orderData;
        let bookList = {};
        let bookNum = 0;
        let sum = 0;
        console.log(_orderData);
        for(let i=0;i<_orderData.length;++i){
            for(let j=0;j<_orderData[i].orderItems.length;++j){
                let bookId = _orderData[i].orderItems[j].bookId;
                let item = _orderData[i].orderItems[j];
                if(bookList[bookId] == null){
                    bookList[bookId] = {
                        name: item.bookInfo.name,
                        author: item.bookInfo.author,
                        description: item.bookInfo.description,
                        image: (item.bookInfo.bookImage == null)?(item.bookInfo.image):(item.bookInfo.bookImage.imageBase64),
                        quantity: item.quantity,
                    }
                }
                else{
                    bookList[bookId].quantity += item.quantity;
                }
                bookNum += item.quantity;
                sum += item.bookInfo.price*item.quantity;
            }
        }
        // console.log(bookList, bookNum, sum);

        const renderHelper = (item) =>{
            const imgStyle = {
                width:"100px",
                height:"100px",
                marginLeft:"30px",
            };
            return(
                <Card>
                    <Row>
                        <Col span={4}>
                            <img src={item.image} alt="book image" style={imgStyle}/>
                        </Col>
                        <Col span={8}>
                            <Row>
                                <Col span={24}>
                                    <Text className="title">{item.name}</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Text className="author">{item.author}</Text>
                                </Col>
                            </Row>
                            <Paragraph className="description" ellipsis={{rows: 2, expandable: false}}>
                                {item.description}
                            </Paragraph>
                        </Col>
                        <Col span={8} offset={4} style={{textAlign:"center"}}>
                            <Text className="font">{item.quantity}</Text>
                        </Col>
                    </Row>
                </Card>
            );
        };
        const bookData = [];
        for(let key in bookList){
            bookData.push(renderHelper(bookList[key]));
        }
        return(
            <div>
                <div className="header" style={{height:40}}>
                    <Row>
                        <Col span={12} style={{textAlign:"center"}}>
                            <Text>图书信息</Text>
                        </Col>
                        <Col span={8} offset={4} style={{textAlign:"center"}}>
                            <Text>购买总数</Text>
                        </Col>
                    </Row>
                </div>

                <div style={{marginBottom:5, textAlign:"right"}}>
                    <Text className="hintWord">按照日期筛选：</Text>
                    <RangePicker onChange={this.dateOnChange}/>
                </div>

                <div style={{marginTop:5}}>
                    {bookData}
                </div>

                <div className="header" style={{height:40, marginTop:50}}>
                    <Row>
                        <Col span={12} style={{textAlign:"center"}}>
                            <Text>书本总数：{bookNum}</Text>
                        </Col>
                        <Col span={8} offset={4} style={{textAlign:"center"}}>
                            <Text>总金额：￥{sum.toFixed(2)}</Text>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    };

    renderAdminStatistics = () =>{
        let _userList = this.state.userList;
        let bookList = {};
        let userList = {};
        // console.log(_userList);
        for(let i=0;i<_userList.length;++i){
            let userId = _userList[i].userId;
            for(let j=0;j<_userList[i].user.orders.length;++j){
                for(let k=0;k<_userList[i].user.orders[j].orderItems.length;++k){
                    let item = _userList[i].user.orders[j].orderItems[k];
                    let bookId = item.bookId;
                    // 添加bookList
                    if(bookList[bookId] == null){
                        bookList[bookId] = {
                            name: item.bookInfo.name,
                            author:item.bookInfo.author,
                            description:item.bookInfo.description,
                            image:(item.bookInfo.bookImage == null)?(item.bookInfo.image):(item.bookInfo.bookImage.imageBase64),
                            quantity:item.quantity,
                        }
                    }
                    else{
                        bookList[bookId].quantity += item.quantity;
                    }
                    // 添加userList
                    if(userList[userId] == null){
                        userList[userId] = {
                            username:_userList[i].username,
                            sum: item.quantity*item.bookInfo.price,
                        }
                    }
                    else{
                        userList[userId].sum += item.quantity*item.bookInfo.price;
                    }
                }
            }
        }
        // console.log(bookList, userList);

        // 对象转化为数组
        let bookData = [];
        let userData = [];
        for(let key in bookList){
            bookData.push(bookList[key]);
        }
        for(let key in userList){
            userData.push(userList[key]);
        }

        // sort
        const compare = (props) =>{
            return (a, b) =>{
                return b[props] - a[props];
            }
        };
        bookData.sort(compare("quantity"));
        userData.sort(compare("sum"));
        // console.log(bookData, userData);

        const bookRenderHelper = (item, index) =>{
            const imgStyle = {
                width:"100px",
                height:"100px",
                marginLeft:"30px",
            };
            return(
                <Card>
                    <Row>
                        <Col span={2} style={{textAlign:"center"}}>
                            <Text className="font">{index + 1}</Text>
                        </Col>
                        <Col span={4}>
                            <img src={item.image} alt="book image" style={imgStyle}/>
                        </Col>
                        <Col span={8}>
                            <Row>
                                <Col span={24}>
                                    <Text className="title">{item.name}</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Text className="author">{item.author}</Text>
                                </Col>
                            </Row>
                            <Paragraph className="description" ellipsis={{rows: 2, expandable: false}}>
                                {item.description}
                            </Paragraph>
                        </Col>
                        <Col span={6} offset={4} style={{textAlign:"center"}}>
                            <Text className="font">{item.quantity}</Text>
                        </Col>
                    </Row>
                </Card>
            );
        };

        const userRenderHelper = (item, index) =>{
            return(
                <Card>
                    <Row>
                        <Col span={2} style={{textAlign:"center"}}>
                            <Text className="font">{index + 1}</Text>
                        </Col>
                        <Col span={8} style={{textAlign:"center"}}>
                            <Text className="font">{item.username}</Text>
                        </Col>
                        <Col span={8} offset={6} style={{textAlign:"center"}}>
                            <Text className="font">￥{item.sum.toFixed(2)}</Text>
                        </Col>
                    </Row>
                </Card>
            );
        };
        // 渲染书籍销量排行榜
        if(this.state.bookStatistics){
            bookData = bookData.map(bookRenderHelper);
            return(
                <div>
                    <div className="header" style={{height:40}}>
                        <Row>
                            <Col span={2} style={{textAlign:"center"}}>
                                <Text>排名</Text>
                            </Col>
                            <Col span={12} style={{textAlign:"center"}}>
                                <Text>图书信息</Text>
                            </Col>
                            <Col span={6} offset={4} style={{textAlign:"center"}}>
                                <Text>销量</Text>
                            </Col>
                        </Row>
                    </div>

                    <div style={{marginBottom:5, textAlign:"right"}}>
                        <Text className="hintWord">按照日期筛选：</Text>
                        <RangePicker onChange={this.dateOnChange}/>
                    </div>

                    <div style={{marginTop:5}}>
                        {bookData}
                    </div>
                </div>
            );
        }
        else{
            userData = userData.map(userRenderHelper);
            return(
                <div>
                    <div className="header" style={{height:40}}>
                        <Row>
                            <Col span={2} style={{textAlign:"center"}}>
                                <Text>排名</Text>
                            </Col>
                            <Col span={8} style={{textAlign:"center"}}>
                                <Text>用户名</Text>
                            </Col>
                            <Col span={8} offset={6} style={{textAlign:"center"}}>
                                <Text>消费总金额</Text>
                            </Col>
                        </Row>
                    </div>

                    <div style={{marginBottom:5, textAlign:"right"}}>
                        <Text className="hintWord">按照日期筛选：</Text>
                        <RangePicker onChange={this.dateOnChange}/>
                    </div>

                    <div style={{marginTop:5}}>
                        {userData}
                    </div>
                </div>
            );
        }

    };

    onChange = () =>{
        if(this.state.bookStatistics){
            this.setState({bookStatistics:false, title:"用户消费榜"});
        }
        else{
            this.setState({bookStatistics:true, title:"图书消费榜"});
        }
    };

    render() {
        let _admin = this.state.admin;
        return(
            <div className="statistic">
                <Row>
                    <Col span={4}>
                        <Title level={4}>{this.state.title}</Title>
                    </Col>
                    {(_admin)?(
                        <Col span={2} offset={18}>
                            <Button type="primary" style={{marginBottom:5, marginLeft:20}} onClick={this.onChange}>
                                切换
                            </Button>
                        </Col>
                        ):(
                        <></>
                    )}
                </Row>
                {
                    (_admin)?
                    (this.renderAdminStatistics()):
                    (this.renderUserStatistics())
                }
            </div>
        );
    }
}

export default Statistics;

