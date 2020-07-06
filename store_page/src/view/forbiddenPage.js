import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Footers from "../component/footer";
import {Result, Button, Layout} from "antd";
import {history} from "../utils/history";

const { Header, Footer, Content } = Layout;

class ForbiddenPage extends  Component{
    goHome = () =>{
        history.push("/");
    };

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
                    <Content style={{...style, minHeight:908}}>
                        <Result
                            status="403"
                            title="403"
                            subTitle="Sorry, you are not authorized to access this page."
                            extra={<Button type="primary" onClick={this.goHome}>Back Home</Button>}
                        />
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

export default withRouter(ForbiddenPage);
