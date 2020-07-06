import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {AsyncStorage,View} from 'react-native';
import {Toast} from '@ant-design/react-native';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/loginScreen';
import HomeScreen from './screens/homeScreen';
import LoadingScreen from './screens/loadingScreen';
import {_removeData} from './utils/localStorage';
import * as userService from "./services/userService"

const Stack = createStackNavigator();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthed: false,
            hasAuthed: false,
        }
    }

    switchPage(){
        this.setState((state) => ({isAuthed:!state.isAuthed}));
    }

    checkAuth = (data) => {
        console.log(data);
        if (!data.status) {
            this.setState({isAuthed: true, hasAuthed: true});
        } else {
            Toast.fail(data.msg);
            _removeData("user");
            this.setState({isAuthed: false, hasAuthed: true});
        }
    };

    componentDidMount() {
        userService.checkSession(this.checkAuth);
    };

    render(){
        return(
            <NavigationContainer>
                <Stack.Navigator>
                    {!this.state.hasAuthed ? (
                        <Stack.Screen name="LoadingScreen" component={LoadingScreen}/>
                    ) : (<Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown:false}} initialParams={{toHomePage:this.switchPage}}/>
                    )}
                    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}} initialParams={{toLoginPage: this.switchPage}}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default App;
