import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import AppText from '../AppText';
import DefaultTextButton from '../DefaultTextButton';
import colors from '../../config/colors';

function MemberRequestList({ isAdmin = false, name, image, onNewMember, onExistingMember, onDeleteMember, style }) {
    return (
        <View style={[styles.requestContainer, style]}>
            {image && <Image style={styles.requestImage} source={image} />}
            <View style={styles.requestDetailContainer}>
                <AppText style={styles.RequestMemberName}>{name}</AppText>
                {isAdmin && <View style={styles.requestButtonContainer}>
                    <DefaultTextButton onPress={onExistingMember} bgColor="mediumGray" title="Existing" />
                    <DefaultTextButton onPress={onNewMember} title="New" />
                    <DefaultTextButton onPress={onDeleteMember} bgColor="danger" title="Delete" />
                </View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    requestContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: colors.white,
        alignItems: 'center',
        borderTopEndRadius: 10,
        borderBottomEndRadius: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        marginBottom: 5,
    },
    requestImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    requestDetailContainer: {
        marginLeft: 10,
        justifyContent: 'center',
        flex: 1
    },
    requestButtonContainer: {
        flexDirection: 'row',
    },
    RequestMemberName: {
        fontWeight: 'bold'
    }
});

export default MemberRequestList;