import React, {Component} from 'react';
import {Modal, Button, message} from 'antd';
import CusUpload from "./cusUpload";
import {postRequest} from "../utils/ajax";

class UploadModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            ModalText: 'Upload the book image',
            visible: false,
            confirmLoading: false,
        }
    }

    showModal = () => {
        console.log(this.props.bookData);
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        let imageBase64 = localStorage.getItem("bookImageBase64");
        if(imageBase64 != null){
            let data = {
                id: this.props.bookData.key,
                name: this.props.bookData.name,
                imageBase64: imageBase64,
            };
            const callback = (data) =>{
                if(data.status == 0){
                    message.success(data.msg);
                }
                else{
                    message.error(data.msg);
                }
            };
            postRequest("http://localhost:8080/updateBookImage", data, callback)
        }
        this.setState({
            ModalText: 'Uploading',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 500);
        localStorage.removeItem("bookImageBase64");
    };

    handleCancel = () => {
        localStorage.removeItem("bookImageBase64");
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <div>
                <Button onClick={this.showModal}>
                    Upload
                </Button>
                <Modal
                    title="Upload image"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <p>{this.state.ModalText}</p>
                    <CusUpload/>
                </Modal>
            </div>
        );
    }

}export default UploadModal;
