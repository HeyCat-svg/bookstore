import React, {Component} from "react";
import '../bootstrap/css/bootstrap.min.css';
import '../bootstrap/bookshop.css';

class Footers extends Component{
    render(){
        return(
            <div className="container-fluid" style={{padding:'0px'}} id="footer">
                <div className="panel-footer">
                    <p>Powered by <a href="https://v3.bootcss.com/"><strong>Bootstrap</strong></a>.</p>
                </div>
            </div>
        );
    }
}

export default Footers;
