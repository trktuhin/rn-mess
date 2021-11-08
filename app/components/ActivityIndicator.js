import React from 'react';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';

function ActivityIndicator(props) {
    return (
        <View style={styles.overlay}>
            <LottieView
                autoPlay
                loop
                source={require('../assets/animations/loader.json')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        position: 'absolute',
        zIndex: 1,
        opacity: 0.8
    }
});

export default ActivityIndicator;