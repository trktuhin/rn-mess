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
        alignItems: 'center'
    },
    requestImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
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