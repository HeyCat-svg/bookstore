import React , {Component} from "react";
import {StyleSheet, Text, View, Image} from "react-native";
import {Carousel} from '@ant-design/react-native';

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    image: {
        height: 150,
        width: 350,
        resizeMode: 'stretch',
    }
});

class CusCarousel extends Component {
    constructor(props) {
        super(props);
    }

    renderPic = () => {

    };

    onHorizontalSelectedIndexChange = () =>{

    };

    render(){
        return(
            <Carousel
                style={styles.wrapper}
                selectedIndex={2}
                autoplay
                autoplayInterval={4000}
                infinite
                afterChange={this.onHorizontalSelectedIndexChange}
            >
                <View style={styles.container}>
                    <Image
                        style={styles.image}
                        source={require('../assets/book2.d685b938.jpg')}
                    />
                </View>
                <View style={styles.container}>
                    <Image
                        style={styles.image}
                        source={require('../assets/book3.43b82982.jpg')}
                    />
                </View>
                <View style={styles.container}>
                    <Image
                        style={styles.image}
                        source={require('../assets/book4.fabf49e9.jpg')}
                    />
                </View>
            </Carousel>
        );
    }
}

export default CusCarousel;
