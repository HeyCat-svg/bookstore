import React, {Component} from 'react';
import {Text,View, Alert, StyleSheet, Image} from 'react-native';


const styles = StyleSheet.create({
    container:{
        height: 100,
        marginLeft: 5,
        marginRight: 5,
    },
    image:{
        width:80,
        height:100,
        resizeMode: 'contain'
    },
    font:{
        fontFamily:"Microsoft YaHei",
    },
    title:{
        fontSize:16,
    },
    description:{
        color:"rgb(150, 150, 150)",
    },
    author:{
        color:"rgb(100, 100, 150)",
    },
    price:{
        fontSize:15,
        color:"rgb(255, 0, 0)",
    },
});

class BookItem extends Component{
    constructor(props) {
        super(props);
    }
    render(){
        let bookInfo = this.props.bookInfo;
        return(
            <View style={styles.container}>
                <View style={{flex: 1, flexDirection:"row"}}>
                    <View style={{flex: 5}}>
                        <Image style={styles.image} source={{uri: bookInfo.bookImage.imageBase64}}/>
                    </View>
                    <View style={{flex:16, flexDirection:"column"}}>
                        <View style={{flex:5}}>
                            <Text style={{...styles.font, ...styles.title, textAlignVertical: 'center'}}>{bookInfo.name}</Text>
                        </View>
                        <View style={{flex:8}}>
                            <Text numberOfLines={2}
                                  ellipsizeMode={'tail'}
                                  style={{...styles.font, ...styles.description, textAlignVertical: 'center'}}
                            >
                                {bookInfo.description}
                            </Text>
                        </View>
                        <View style={{flex:5, flexDirection:"row"}}>
                            <View style={{flex:8}}>
                                <Text style={{...styles.font, ...styles.author, textAlignVertical: 'center'}}>{bookInfo.author}</Text>
                            </View>
                            <View style={{flex:3}}>
                                <Text style={{...styles.font, ...styles.price, textAlignVertical: 'center'}}>￥{bookInfo.price}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default BookItem;
