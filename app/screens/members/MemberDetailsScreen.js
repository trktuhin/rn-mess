import React, { useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';

import AppText from '../../components/AppText';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import IconButton from '../../components/IconButton';
import routes from '../../navigation/routes';
import globalVariables from '../../globalVariables';
import memberApi from '../../api/member';
import ActivityIndication from '../../components/ActivityIndicator';

function MemberDetailsScreen({ route, navigation }) {
    const [loading, setLoading] = useState(false);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton name='pencil' bgColor={colors.primary} onPress={() => navigation.navigate(routes.NEWEDITMEMBER, { id: member.id })} />
            ),
        });
    }, [navigation]);

    const handleDelete = () => {
        Alert.alert('Are you sure?', `${member.firstName} will be deleted from your mess`,
            [
                { text: 'Cancel' },
                {
                    text: 'Yes', onPress: () => {
                        setLoading(true);
                        var response = memberApi.deleteMember(member.id).then((response) => {
                            if (!response.ok) {
                                return alert(response?.data ? response.data : 'Could not delete member');
                            }
                            navigation.pop();
                        }).catch((err) => console.log(err)).finally(() => setLoading(false))
                    }
                }
            ]);
    }

    const member = route.params.member;
    return (
        <ScrollView>
            {loading && <ActivityIndication visible={loading} />}
            <Image style={styles.image} source={member.photoName ? { uri: globalVariables.IMAGE_BASE + member.photoName } : require("../../assets/defaultuser.jpg")} />
            <View style={styles.detailContainer}>
                <AppText style={styles.title}>{member.firstName} {member.lastName}</AppText>
                {member.profession && <View style={styles.iconContainer}>
                    <Icon name="briefcase" size={30} iconColor={colors.darkGary} bgColor="transparent" />
                    <AppText style={styles.subtitle}>{member.profession}</AppText>
                </View>}
                {member.mobile && <View style={styles.iconContainer}>
                    <Icon name="cellphone" size={30} iconColor={colors.darkGary} bgColor="transparent" />
                    <AppText style={styles.subtitle}>{member.mobile}</AppText>
                </View>}
                <View style={styles.iconContainer}>
                    <Icon name="food-fork-drink" size={30} iconColor={colors.darkGary} bgColor="transparent" />
                    <AppText style={styles.subtitle}>({member.dBreakfast} + {member.dLunch} + {member.dDinner})</AppText>
                </View>
            </View>
            <View style={styles.bottomOptions}>
                <IconButton name="food" bgColor={colors.mediumGray} />
                <IconButton name="trash-can" bgColor={colors.danger} onPress={handleDelete} />
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 400
    },
    detailContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    subtitle: {
        color: colors.mediumGray,
        fontSize: 20,
        fontWeight: '500',
        marginVertical: 7,
    },
    bottomOptions: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
});

export default MemberDetailsScreen;