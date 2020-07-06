import React, {Component} from "react";
import ReactDOM from "react-dom";
import { Upload, message, Button} from "antd";
import {UploadOutlined} from '@ant-design/icons';
import "antd/dist/antd.css";

class CusUpload extends Component{
    constructor(props) {
        super(props);
    }

    cusRequest = (option) => {
        const formData = new FormData();
        formData.append("files[]", option.file);
        const reader = new FileReader();
        reader.readAsDataURL(option.file);
        reader.onloadend = (e) => {
            // console.log(e.target.result);
            let imgBase64 = e.target.result;
            localStorage.setItem("bookImageBase64", imgBase64.toString());
            if (e && e.target && e.target.result) {
                option.onSuccess();
                message.success("Upload succeed");
            }
        };
    };

    beforeUpload = (file) =>{
        if (!(file.type === "image/jpeg" || file.type === "image/png")){
            message.error("请上传JPG或PNG格式文件！");
            return false;
        }
        if (file.size / 1024 / 1024 > 2){
            message.error("图片大小须小于2M！");
            return false;
        }
        return true;
    };

    render() {
        const props = {
            customRequest: this.cusRequest,
            beforeUpload: this.beforeUpload,
        };
        return(
            <Upload {...props}>
                <Button>
                    <UploadOutlined/>Click to Upload
                </Button>
            </Upload>
        );
    }
}

export default CusUpload;
