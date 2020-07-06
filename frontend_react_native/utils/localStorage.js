import {AsyncStorage,} from 'react-native';

let _storeData = async (key, data) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

let _removeData = async (key) => {
    try{
        await AsyncStorage.removeItem(key);
    } catch (error){
        console.log(error);
    }
};

let _getData = (key, callback) => {
    try {
        AsyncStorage.getItem(key)
            .then(value => {
                callback(value);
            })
            .catch(error => console.log(error));
    } catch (error) {
        console.log(error);
    }
};

export {_storeData, _getData, _removeData};


