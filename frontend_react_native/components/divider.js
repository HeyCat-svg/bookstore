import React, { PureComponent } from 'react'
import {View, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    divider:{
        borderTopWidth:1,
        borderTopColor:"rgb(240,240,240)",
        marginTop:6,
        marginBottom:6,
        marginLeft:2,
        marginRight:2,
        height:0,
    }
});

class Divider extends PureComponent {
    render () {
        let basicStyle = {
            borderTopWidth: this.props.lineHeight,
            borderTopColor: this.props.color,
        };
        return (
            <View style={{...styles.divider, ...basicStyle, ...this.props.cusStyle }}>
            </View>
        );
    }
}

Divider.defaultProps = {
    lineHeight: 1,
    color: '#bdbdbd',
    cusStyle: {}
};

export default Divider;
