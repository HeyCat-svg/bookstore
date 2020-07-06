import React,{Component, useContext, useState, useEffect, useRef} from 'react';
import {withRouter} from "react-router-dom";
import {Table, Button, Input, Popconfirm, Typography, Divider, Form,
    message, Drawer, Col, Row, InputNumber, notification, Layout, Upload,} from 'antd';
import { PlusOutlined , UploadOutlined} from '@ant-design/icons';
import Footers from "../component/footer";
import NavBar from "../component/navBar";
import CusUpload from "../component/cusUpload";
import UploadModal from "../component/uploadModal";
import {postRequest} from "../utils/ajax";
import '../bootstrap/css/bootstrap.min.css';
import '../bootstrap/bookshop.css';
import 'antd/dist/antd.css';
import '../bootstrap/Admin.css'

const { Header, Footer, Sider, Content } = Layout;
const {Search} = Input;
const { Title, Paragraph, Text } = Typography;
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async e => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};




class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
        };
    }

    style = {
        textAlign:'center',
    };
    render() {
        const style = {
            backgroundColor: "rgba(255,255,255,0)",
            height:"auto",
            padding:"0px",
            lineHeight:"30px",
        };
        return(
            <div className="adminPage">
                <Layout style={style}>
                    <Header style={style}>
                        <NavBar/>
                    </Header>
                    <Content style={{...style, minHeight:838}}>
                        <div className="adminContainer">
                            <Typography>
                                <Title>Manage Books</Title>
                            </Typography>
                            <AdminTable bookData={this.state.data} style={{height:"100%"}}/>
                        </div>
                    </Content>
                    <Footer style={style}>
                        <div style={this.style}>
                            <Footers style={this.style}/>
                        </div>
                    </Footer>
                </Layout>
            </div>
        );
    }
}

class AdminTable extends Component {
    constructor(props) {
        super(props);
        //this.Search = Input.Search;
        this.form = React.createRef();
        this.state = {
            count:this.props.bookData.length,
            filteredInfo: null,
            sortedInfo: null,
            preSearchData:this.props.bookData,
            dataSource: this.props.bookData,
            visible:false,
        }
    }

    getData = () =>{
        const callback = (data) =>{
            this.buildObject(data);
        };
        postRequest("http://localhost:8080/getBooks",{},callback);
    };

    buildObject = (arrayData) =>{
        const list = [];
        for(let i = 0;i < arrayData.length; ++i){
            const newData = {
                key: parseInt(arrayData[i].id),
                name: arrayData[i].name,
                author: arrayData[i].author,
                image: (arrayData[i].bookImage == null)?(arrayData[i].image):(arrayData[i].bookImage.imageBase64),
                isbn: arrayData[i].isbn,
                inventory: parseInt(arrayData[i].inventory),
                price: parseFloat(arrayData[i].price),
            };
            list.push(newData);
        }
        const tmp = [...list];
        this.setState(()=>({preSearchData:tmp,dataSource:tmp,count:tmp.length}));
    };

    sendDeletion = (id) => {
        const callback = (data) =>{
            message.success(data["msg"]);
        };
        postRequest("http://localhost:8080/deleteBook?id="+id,{},callback);
    };

    sendEdit = (row) =>{
        const callback = (data) =>{
            if(!data["status"]){
                message.success(data["msg"]);
            }
            else{
                message.error(data["msg"]);
            }
        };
        postRequest("http://localhost:8080/editBook",row,callback)
    };

    onSearch = (value, colAttri)=>{
        let tmp=[...this.state.preSearchData];
        const reg = new RegExp(value.toString(),'i');
        switch(colAttri){
            case 'Name':{
                for(let i = 0;i<tmp.length;++i){
                    if(!reg.test(tmp[i].name.toString())){
                        tmp.splice(i,1);
                        i--;
                    }
                }
                break;
            }
            case 'Author':{
                for(let i = 0;i<tmp.length;++i){
                    if(!reg.test(tmp[i].author.toString())){
                        tmp.splice(i,1);
                        i--;
                    }
                }
                break;
            }
            case 'Image':{
                for(let i = 0;i<tmp.length;++i){
                    if(!reg.test(tmp[i].image.toString())){
                        tmp.splice(i,1);
                        i--;
                    }
                }
                break;
            }
            case 'ISBN':{
                for(let i = 0;i<tmp.length;++i){
                    if(!reg.test(tmp[i].isbn.toString())){
                        tmp.splice(i,1);
                        i--;
                    }
                }
                break;
            }
            case 'Price':{
                for(let i = 0;i<tmp.length;++i){
                    if(!reg.test(tmp[i].price.toString())){
                        tmp.splice(i,1);
                        i--;
                    }
                }
                break;
            }
            default:{}
        }
        this.setState(()=>({dataSource:tmp}));
    };

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    renderSearch = (colAttri) => {
        return (
            <div>
                <p>{colAttri}</p>
                <Search
                    placeholder="input search text"
                    onSearch={value => {this.onSearch(value,colAttri)}}
                    style={{ width: 180 }}
                />
            </div>
        );
    };

    deleteConfirm = (key) =>{
        const preSearchData = this.state.preSearchData;
        const count =this.state.count;
        //let tmp=[...this.state.preSearchData];
        for(let i = 0;i<preSearchData.length;++i){
            if(preSearchData[i].key===key){
                preSearchData.splice(i,1);
                break;
            }
        }
        let tmp = [...preSearchData];
        this.setState({
            dataSource:tmp,
            count:count - 1,
            preSourceData:tmp,
        });
        this.sendDeletion(key);
        //this.render();
        console.log(key,this.state.dataSource.length);
    };

    handleSave = row => {
        const newData = [...this.state.preSearchData];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.sendEdit({ ...item, ...row });
        this.setState({
            preSearchData:newData,
            dataSource: newData,
        });
    };

    showDrawer = () =>{
        this.setState({visible:true});
    };

    onClose = () =>{
        this.form.current.resetFields();
        this.setState({visible:false});
    };

    onSubmit = () =>{
        let formInfo = this.form.current.getFieldsValue();
        let flag = true;
        let imgBase64 = localStorage.getItem("bookImageBase64");
        if(imgBase64 == null){
            notification.open({
                message: 'Empty Image',
                description:
                    'Please upload book image.',
                duration: 3,
            });
            return;
        }
        formInfo.imageBase64 = imgBase64;
        for(let key in formInfo){
            if(formInfo[key]==null){
                flag = false;
                break;
            }
        }
        if(formInfo.inventory<0||formInfo.price<=0){
            flag = false;
        }

        if(flag){
            const callback = (data) =>{
                message.success(data["msg"]);
            };
            console.log(formInfo);
            postRequest("http://localhost:8080/addBook",formInfo,callback);
            this.form.current.resetFields();
            localStorage.removeItem("bookImageBase64");
            this.setState({visible:false});
        }
        else{
            notification.open({
                message: 'Wrong Format!',
                description:
                    'Please enter information with correct format.',
                duration: 3,
            });
        }
    };

    render() {
        let { sortedInfo, filteredInfo } = this.state;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        const paginationProps = {
            pageSize: 9,
        };
        const columns = [
            {
                title: this.renderSearch('Name'),
                dataIndex: 'name',
                key: 'name',
                filteredValue: filteredInfo.name || null,
                onFilter: (value, record) => record.name.includes(value),
                sorter: (a, b) => a.name.length - b.name.length,
                sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
                ellipsis: false,
                editable: true,
            },
            {
                title: this.renderSearch('Author'),
                dataIndex: 'author',
                key: 'author',
                sorter: (a, b) => a.author.length - b.author.length,
                sortOrder: sortedInfo.columnKey === 'author' && sortedInfo.order,
                ellipsis: false,
                editable: true,
            },
            {
                title: this.renderSearch('Image'),
                dataIndex: 'image',
                key: 'image',
                render:(text, record) => (
                    <div>
                        <img src={record.image} alt="bookImage" className="bookImage"/>
                    </div>
                ),
                filteredValue: filteredInfo.address || null,
                onFilter: (value, record) => record.image.includes(value),
                sorter: (a, b) => a.image.length - b.image.length,
                sortOrder: sortedInfo.columnKey === 'image' && sortedInfo.order,
                ellipsis: false,
                editable: false,
            },
            {
                title: this.renderSearch('ISBN'),
                dataIndex:'isbn',
                key:'isbn',
                sorter: (a, b) => a.isbn - b.isbn,
                sortOrder: sortedInfo.columnKey === 'isbn' && sortedInfo.order,
                ellipsis: false,
                editable: true,
            },
            {
                title: this.renderSearch('Inventory'),
                dataIndex:'inventory',
                key:'inventory',
                sorter: (a, b) => a.inventory.length - b.inventory.length,
                sortOrder: sortedInfo.columnKey === 'inventory' && sortedInfo.order,
                ellipsis: false,
                editable: true,
            },
            {
                title: this.renderSearch('Price'),
                dataIndex:'price',
                key:'price',
                sorter: (a, b) => a.price - b.price,
                sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
                ellipsis: false,
                editable: true,
            },
            {
                title:'Action',
                dataIndex:'action',
                key:'action',
                render:(text,record) =>{
                    return(
                        <div>
                            <Popconfirm
                                title="Are you sure delete this task?"
                                onConfirm={()=>this.deleteConfirm(record.key)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button>Delete</Button>
                            </Popconfirm>
                            <UploadModal bookData={record}/>
                        </div>

                    );
                }
            }
        ];

        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };

        const changedColumns = columns.map(col => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });

        return (
            <div>
                <div className="table-operations">
                    <Button type="primary" onClick={this.showDrawer} style={{marginBottom:16}}>
                        <PlusOutlined/>New Book
                    </Button>
                    <Button onClick={this.getData} style={{ marginLeft:10, marginBottom: 16 }}>Get Data</Button>
                </div>
                <Table components={components}
                       rowClassName={() => 'editable-row'}
                       bordered
                       columns={changedColumns} dataSource={this.state.dataSource}
                       onChange={this.handleChange}
                       pagination={ paginationProps }/>

                <Drawer
                    title="Create a new book"
                    width={720}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div style={{textAlign: 'right',}}>
                            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button onClick={this.onSubmit} type="primary">
                                Submit
                            </Button>
                        </div>
                    }
                >
                    <Form layout="vertical" hideRequiredMark ref={this.form}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Name"
                                    rules={[{ required: true, message: 'Please enter book name' }]}
                                >
                                    <Input placeholder="Please enter book name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="author"
                                    label="Author"
                                    rules={[{ required: true, message: 'Please enter author' }]}
                                >
                                    <Input
                                        style={{ width: '100%' }}
                                        placeholder="Please enter author"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="isbn"
                                           label="ISBN"
                                           rules={[{ required: true, message: 'Please enter ISBN' }]}
                                >
                                    <Input
                                        style={{ width: '100%' }}
                                        placeholder="Please enter ISBN"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="type"
                                           label="Type"
                                           rules={[{ required: true, message: 'Please enter type'}]}
                                >
                                    <Input
                                        style={{ width: '100%' }}
                                        placeholder="Please enter type"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="url"
                                    label="Image Url"
                                    rules={[{ required: true, message: 'Please enter url' }]}
                                >
                                    <Input
                                        style={{ width: '100%' }}
                                        addonBefore="http://"
                                        // addonAfter=".com"
                                        placeholder="Please enter url"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="price"
                                    label="Price"
                                    rules={[{ required: true, message: 'Please enter price' },
                                        {type:"number", min:0}]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="Please enter price"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="inventory"
                                    label="Inventory"
                                    rules={[{ required: true, message: 'Please enter inventory' },
                                        {type:"number", min:0}]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="Please enter inventory"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[{required: true, message: 'please enter book description',},]}
                                >
                                    <Input.TextArea rows={5} placeholder="please enter book description" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="imageBase64"
                                    label="Book Image"
                                >
                                    <CusUpload/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Drawer>
            </div>
        );
    }
}

export default withRouter(Admin);
