import React, {Component} from "react";
import {Carousel} from "antd";

class Slider extends Component{
    render(){
        const style = {marginLeft:15, width:"87%"};
        return(<Carousel autoplay style={style}>
                <div>
                    <img style={{width:844}} src={require("../resources/image/book2.d685b938.jpg")} alt="slider"/>
                </div>
                <div>
                    <img style={{width:844}} src={require("../resources/image/book3.43b82982.jpg")} alt="slider"/>
                </div>
                <div>
                    <img style={{width:844}} src={require("../resources/image/book4.fabf49e9.jpg")} alt="slider"/>
                </div>
            </Carousel>
        );
    }
}

export default Slider;
