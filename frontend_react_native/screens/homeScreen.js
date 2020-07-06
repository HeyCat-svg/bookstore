import React, {Component}from 'react';
import {Text,View, StyleSheet, Image, Platform} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Grid, Icon } from '@ant-design/react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider} from 'react-native-safe-area-context';
import BookListScreen from './bookListScreen';
import DetailScreen from './detailScreen';
import CartScreen from './cartScreen';
import OrderCompleteScreen from './orderCompleteScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    tabIcon:{
        width:23,
        height:23,
    }
});

class BookListAndDetail extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        let {hideTab, showTab} = this.props.route.params;
        return(
            <SafeAreaProvider>
                <Stack.Navigator>
                    <Stack.Screen name="BookList" component={BookListScreen}
                                  options={{headerShown:false}}
                                  initialParams={{showTab:showTab}}
                    />
                    <Stack.Screen name="BookDetail" component={DetailScreen}
                                  options={{headerShown:false}}
                                  initialParams={{hideTab:hideTab, showTab:showTab}}
                    />
                </Stack.Navigator>
            </SafeAreaProvider>
        );
    }
}

class HomeScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "home",
            tabVisible:true,
        }
    }

    onChangeTab = (name) =>{
        this.setState({selectedTab:name});
    };

    showTab = () => {
        this.setState({tabVisible:true});
    };

    hideTab = () =>{
        this.setState({tabVisible:false});
    };

    render(){
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === "Home") {
                            iconName ="home";
                        } else if (route.name === "Cart") {
                            iconName = "shoppingcart";
                        } else if (route.name === "Profile") {
                            iconName = "user";
                        }
                        return  <AntDesign name={iconName} size={size} color={color}/>;
                    },
                    tabBarVisible:this.state.tabVisible,
                })}
                tabBarOptions={{
                    activeTintColor: "tomato",
                    inactiveTintColor: "gray",
                    showIcon: true,
                    showLabel: true,
                }}
            >
                <Tab.Screen name="Home" component={BookListAndDetail} initialParams={{ showTab:this.showTab, hideTab:this.hideTab }}/>
                <Tab.Screen name="Cart" component={CartScreen} initialParams={{ showTab:this.showTab, hideTab:this.hideTab }}/>
                <Tab.Screen name="Profile" component={OrderCompleteScreen}/>
            </Tab.Navigator>
        );
    }
}

export default HomeScreen;
