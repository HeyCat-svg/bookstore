import React, {Component} from "react";
import {Menu} from "antd";
import {CrownOutlined, UserOutlined, ShoppingCartOutlined, UnorderedListOutlined,
    TableOutlined, TeamOutlined, LineChartOutlined} from "@ant-design/icons";
import {history} from "../utils/history";

const { SubMenu } = Menu;

class SiderNav extends Component {
    handleClick = e => {
        // console.log('click ', e);
        let key = e.key;
        switch(key){
            case "cart": history.push("/cartPage");break;
            case "order": history.push("/orders");break;
            case "bookManage": history.push("/admin");break;
            case "userList": history.push("/userList");break;
            case "statistics": history.push("/statistics");break;
            default:
        }
    };

    render() {
        let admin = JSON.parse(localStorage.getItem("user")).userType;
        return (
            <Menu
                onClick={this.handleClick}
                style={{ width: 300, height:500 }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['user']}
                mode="inline"
            >
                <SubMenu
                    key="user"
                    title={
                        <span>
                            <UserOutlined />
                            <span>User Routine</span>
                        </span>
                    }
                >
                    <Menu.Item key="cart">
                        <span>
                            <ShoppingCartOutlined />
                            <span>Cart</span>
                        </span>
                    </Menu.Item>
                    <Menu.Item key="order">
                        <span>
                            <UnorderedListOutlined />
                            <span>
                                Order
                            </span>
                        </span>
                    </Menu.Item>
                    <Menu.Item key="statistics">
                        <span>
                            <LineChartOutlined />
                            <span>
                                Statistics
                            </span>
                        </span>
                    </Menu.Item>
                </SubMenu>
                {(admin)?
                    (
                        <SubMenu
                            key="admin"
                            title={
                                <span>
                            <CrownOutlined />
                            <span>Admin</span>
                        </span>
                            }
                        >
                            <Menu.Item key="bookManage">
                        <span>
                            <TableOutlined />
                            <span>
                                Manage Books
                            </span>
                        </span>
                            </Menu.Item>
                            <Menu.Item key="userList">
                        <span>
                            <TeamOutlined />
                            <span>
                                User List
                            </span>
                        </span>
                            </Menu.Item>
                        </SubMenu>
                    ) : (
                        <>
                        </>
                    )}
            </Menu>
        );
    }
}

export default SiderNav;
