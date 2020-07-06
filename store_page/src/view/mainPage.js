import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Button, Layout, Card, Drawer, Row, Col, Typography} from 'antd';
import NavBar from "../component/navBar";
import SiderNav from "../component/sider";
import Slider from "../component/slider";
import Footers from "../component/footer";
import BookDetail from "../component/bookDetail";
import {postRequest} from "../utils/ajax";
import '../bootstrap/css/bootstrap.min.css';
import '../bootstrap/bookshop.css';
import 'antd/dist/antd.css';

const { Title, Text } = Typography;
const { Header, Footer, Sider, Content } = Layout;

//dataStructure: [[id, name, author, image, isbn, inventory, price]...]

class MainPage extends Component{
    //NavBar中的Search组件的输入改变时，调用本组件的SearchOnChange函数，改变本组件state，并向下转递更新Search中的内容
    constructor(props) {
        super(props);
        this.state={
            searchText:"",
            data:[],
            loading:true,
        };
    }

    componentDidMount(){
        const callback = (data) =>{
            this.setState({data:data});
        };
        postRequest("http://localhost:8080/getBooks",{},callback);
    }

    searchOnChange = (text) =>{
        this.setState({searchText:text});
    };

    render(){
        const style = {
            backgroundColor: "rgba(255,255,255,0)",
            height:"auto",
            padding:"0px",
            lineHeight:"30px",
        };

        return(
            <div className="main">
                <Layout style={style}>
                    <Header style={style}>
                        <NavBar callbackFun={this.searchOnChange} searchText={this.state.searchText}/>
                    </Header>
                    <Layout style={style}>
                        <Sider style={style}>
                            <SiderNav/>
                        </Sider>
                        <Content style={{...style,minHeight:838}}>
                            <Contents goodsData={this.state.data} searchText={this.state.searchText}/>
                        </Content>
                    </Layout>
                    <Footer style={style}>
                        <Footers/>
                    </Footer>
                </Layout>
            </div>
        );
    }
}

class Contents extends Component{
    render(){
        return(
            <div className="container">
                <Slider/>
                <Item data={this.props.goodsData} searchText={this.props.searchText}/>
            </div>
        );
    }
}


class Item extends Component{
    constructor(props) {
        super(props);
        this.totalNum=this.props.data.length;   //  所有商品数量
        this.preSearchData=this.props.data;  //原始数据
        this.loadedNum=0;   //页面已加载的书
        this.data=this.props.data;  //现有数据

        this.flag=false;    //这个flag用来判断事件是否从rowPage组件传过来的
        this.state={page:1};
    }

    freshPage = (page) =>{
        this.flag = true;
        let pattern = new RegExp("[1-9]","g");
        if(pattern.test(page)){
            this.setState({page:parseInt(page)});
        }
    };

    filterFun = () =>{
        this.preSearchData = this.props.data;
        let searchText=this.props.searchText;
        if(searchText.length!==0&&this.flag===false){   //搜索栏变化引起的render()
            this.data = this.preSearchData.filter((ele)=>{
                let pattern = new RegExp(searchText.toString(),"i");
                return pattern.test(ele["name"]);
            });
            this.loadedNum=0;   //过滤后将商品页面重置
        }
        else if(searchText.length===0&&this.flag===false){  //搜索栏变化引起的render()
            this.data=this.preSearchData;
            this.loadedNum=0;   //过滤后将商品页面重置
        }
        else if(this.flag===true){  //翻页变化引起的render()
            this.loadedNum=6*(this.state.page-1);
            console.log(this.loadedNum);
            this.flag=false;
        }
        this.totalNum=this.data.length;
    };

    packArray = () =>{  //问题很大，目前测试用的函数
        let bookInfo = this.data;
        const list = [];
        for(let i=this.loadedNum;i<this.loadedNum+3&&i<this.totalNum;++i){
            list.push(bookInfo[i]);
        }
        this.loadedNum+=list.length;
        return list;
    };

    render(){
        this.filterFun();
        return(
            <div>
                <div className="row" style={{marginTop:'30px'}}>
                    <div className="col-md-12">
                        <div className="container-fluid">
                            <Raws bookInfo={this.packArray()}/>
                            <Raws bookInfo={this.packArray()}/>
                        </div>
                    </div>
                </div>
                <RowPage goodsNum={this.totalNum} freshFun={this.freshPage}/>
            </div>
        );
    }
}

class RowPage extends Component{
    constructor(props){     //props中包含商品数量 this.props.goodsNum
        super(props);
        this.state = {
            pageNum:10,
            page:1,
        };
    }

    handleClick = (e) =>{
        this.props.freshFun(e.target.innerText);
    };

    renderList = () => {
        const num = this.props.goodsNum;
        const list = [];
        let maxPage = Math.ceil(num/6);
        for(let i=0;i<maxPage;++i){
            list.push(
                <li><a onClick={this.handleClick}>{i+1}</a></li>
            );
        }
        return list;
    };

    render(){
        return(
            <nav>
                <ul className="pagination">
                    <li>
                        <a href="#"><span>&laquo;</span></a>
                    </li>
                        {this.renderList()}
                    <li>
                        <a href="#"><span>&raquo;</span></a>
                    </li>
                </ul>
            </nav>
        );
    }
}

class Raws extends Component{    //由原来的raw改写的，一个Raw有三行
    renderItem = ()=>{   //bookInfo结构：[["imageUrl","title","price",],...,]
        const bookInfo = this.props.bookInfo;
        const raw = [];
        for(let i=0;i<this.props.bookInfo.length;++i){
            raw.push(
                <div className="row">
                    <Cols bookInfo={bookInfo[i]}/>
                </div>
            );
        }
        return raw;
    };

    render(){
        return(
            <div>
                {this.renderItem()}
            </div>
        );
    }
}

class Cols extends Component{
    render(){
        const bookInfo = this.props.bookInfo;   //bookInfo结构：["imageUrl","title","price",]
        return(
            <div className="col-md-12">
                <Goods bookInfo={bookInfo}/>
            </div>
        );
    }
}

class Goods extends Component{
    constructor(props) {
        super(props);
        this.state = {visible:false};
    }

    showDrawer = () => {
        // this.getDescription(this.props.bookInfo["id"]);
        this.setState({visible:true,});
    };

    onClose = () =>{
        this.setState({visible:false,});
    };

    getDescription = (id) => {
        const callback = (data) =>{
            this.description.innerText = data["description"];
        };
        postRequest("http://localhost:8080/getBook?id="+id,{},callback);
    };

    render(){
        const bookInfo = this.props.bookInfo;   //bookInfo结构：["imageUrl","title","price",]
        console.log(bookInfo);
        const fontStyle = {color:"rgba(255,0,0,1)",fontSize:"20px"};
        const imgStyle = {width:"180px",height:"180px",float:"left",};
        const style = {padding:"40px", textAlign:"center", width:"100%"};
        const cardStyle = {width:"90%", height:190 ,marginBottom:"10px",borderRadius:"5px",
            paddingBottom:"0px", backgroundColor: "rgba(255,255,255,0.95)"};

        const imgData = (bookInfo.bookImage == null)?(bookInfo.image):(bookInfo.bookImage.imageBase64);

        return(
            <div>
                <Card style={cardStyle}>
                    <Row>
                        <Col span={6}>
                            <img src={imgData} alt="sample" style={imgStyle}/>
                        </Col>
                        <Col span={12}>
                            <div style={style}>
                                <Row>
                                    <Col span={24}>
                                        <Title level={4}>{bookInfo["name"]}</Title>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <p>{bookInfo["author"]}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <p><span style={fontStyle}>{"¥"+bookInfo["price"]}</span></p>
                                    </Col>
                                </Row>
                            </div>

                        </Col>
                        <Col span={6}>
                            <div style={style}>
                                <Button type="primary" onClick={this.showDrawer}>More details</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
                <Drawer
                    title="Book Information"
                    placement="bottom"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    height={500}
                >
                    <BookDetail trigger={this.onClose} bookId={bookInfo["id"]} name={bookInfo["name"]} author={bookInfo["author"]}
                            isbn={bookInfo["isbn"]} image={imgData} inventory={bookInfo["inventory"]}
                            price={bookInfo["price"]} type={bookInfo["type"]} description={bookInfo["description"]}/>
                </Drawer>
            </div>
        );
    }
}

export default withRouter(MainPage);
