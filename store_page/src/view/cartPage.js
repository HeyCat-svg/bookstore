import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Button, Table, InputNumber, Popconfirm, message, Layout,
            Row, Col, Typography} from 'antd';
import NavBar from "../component/navBar";
import Footers from "../component/footer";
import {postRequest} from "../utils/ajax";
import {history} from "../utils/history";
import '../bootstrap/css/bootstrap.min.css';
import '../bootstrap/bookshop.css';
import '../bootstrap/cartPage.css';
import 'antd/dist/antd.css';

const { Header, Footer, Sider, Content } = Layout;
const { Title, Text } = Typography;

class CartPage extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        const style = {
            backgroundColor: "rgba(255,255,255,0)",
            height:"auto",
            padding:"0px",
            lineHeight:"30px",
        };
        return(
            <div className="cartPage" id="wrap">
                <Layout style={style}>
                    <Header style={style}>
                        <NavBar/>
                    </Header>
                    <Content style={{...style,minHeight:838}}>
                        <ItemTable/>
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

class ItemTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            flag:true,
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
            data:[],
        };
        // console.log(this.props.cartData);
    }

    componentDidMount() {
        let userInfo = JSON.parse(localStorage.getItem("user"));
        postRequest("http://localhost:8080/getCart?userId="+userInfo.userId,{},this.buildObject);
    }

    buildObject = (data) =>{
        console.log(data);
        let srcData = [];
        for(let i = 0; i < data.length; ++i){
            let obj = {
                key: data[i].id,
                bookInfo: data[i].bookInfo,
                price: data[i].bookInfo.price,
                quantity: data[i].quantity,
                sum: data[i].quantity*data[i].bookInfo.price,
            };
            srcData.push(obj);
        }
        this.setState(()=>({data:srcData}));
    };

    quantityChange = (value, key) => {
        let tmp =[...this.state.data];
        for(let i = 0;i < tmp.length;++i){
            if(tmp[i].key===key){
                tmp[i].sum = value * tmp[i].price;
                break;
            }
        }
        this.setState(()=>({data:tmp}));
        console.log('changed', value);
    };

    deleteConfirm = (key) =>{
        const data = this.state.data;
        for(let i = 0;i<data.length;++i){
            if(data[i].key===key){
                data.splice(i,1);
                break;
            }
        }
        let tmp = [...data];

        this.sendDeletion(key);
        this.setState(()=>({data:tmp}));
        // console.log(key,this.state.data.length);
    };

    sendDeletion  = (id) =>{
        const callback = (data) =>{
            if(!data.status){
                message.success(data.msg);
            }
            else{
                message.error(data.msg);
            }
        };
        postRequest("http://localhost:8080/deleteCart?cartId="+id,{},callback);
    };

    start = () => {
        this.setState({ loading: true });
        this.submitOrder();
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
            history.push("/orderComplete");
        }, 1500);
    };

    submitOrder = () =>{
        console.log(this.state.selectedRowKeys);
        const callback = (data) =>{
            if(!data.status){
                message.success(data.msg);
            }
            else{
                message.error(data.msg);
            }
        };
        let jsonData = {
            data: JSON.stringify(this.state.selectedRowKeys),
        };
        postRequest("http://localhost:8080/cartToOrder",jsonData,callback);
    };

    totalSum = (selectedRowKeys)=>{
        let sum=0;
        for(let i=0;i<selectedRowKeys.length;++i){
            for(let j = 0;j<this.state.data.length;++j){
                if(selectedRowKeys[i]===this.state.data[j].key){
                    sum += this.state.data[j].sum;
                    break;
                }
            }
        }
        return sum;
    };

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState(()=>({ selectedRowKeys }));
    };

    columns = [
        {
            title: 'Item Information',
            dataIndex: 'itemInfo',
            key: 'itemInfo',
            render: (text,record)=>{
                return(
                    <ItemInfo bookData={record.bookInfo}/>
                );
            }
        },
        {
            title: 'Unit Price',
            dataIndex: 'price',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            render:(text,record)=>{
                return(
                    <InputNumber min={1} max={record.bookInfo.inventory} defaultValue={record.quantity}
                                 onChange={value=>{this.quantityChange(value,record.key);}} />
                );
            }
        },
        {
            title:'Sum',
            dataIndex:'sum',
        },
        {
            title:'Action',
            dataIndex:'action',
            render:(text,record) =>{
                return(
                    <Popconfirm
                        title="Are you sure delete this task?"
                        onConfirm={()=>this.deleteConfirm(record.key)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button>Delete</Button>
                    </Popconfirm>
                );
            }
        }

    ];

    render(){
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const paginationProps = {pageSize: 4,};

        return(
            <div className="container" style={{width:"1500px"}}>
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
                        Pay
                    </Button>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                    </span>
                    <span style={{ marginLeft: 10 }}>
                        {hasSelected ? `Total amount: ${this.totalSum(selectedRowKeys)} yuan` : ''}
                    </span>
                </div>
                <Table rowSelection={rowSelection}
                       columns={this.columns}
                       dataSource={this.state.data}
                       pagination={paginationProps}
                />
            </div>
        );
    }
}

class ItemInfo extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        const imgStyle = {width:'160px', height:'160px', float:'left',};

        return(
            <div className="cartItem">
                <img src={this.props.bookData.image} alt="book1" style={imgStyle}/>
                <div style={{paddingLeft:20,paddingTop:10, float:"left"}}>
                    <Title level={4}>
                        {this.props.bookData.name}
                    </Title>
                    <p>
                        <strong>Author:&emsp;</strong>{this.props.bookData.author}
                    </p>
                    <p style={{width:350}}>
                        {this.props.bookData.description}
                    </p>
                </div>
            </div>
        );
    }
}

export default withRouter(CartPage);



