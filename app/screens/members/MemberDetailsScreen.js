import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import AppText from '../../components/AppText';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import IconButton from '../../components/IconButton';
import routes from '../../navigation/routes';

function MemberDetailsScreen({ route, navigation }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <IconButton name='pencil' bgColor={colors.primary} onPress={() => navigation.navigate(routes.NEWEDITMEMBER, { id: member.id })} />
            ),
        });
    }, [navigation]);


    const member = route.params.member;
    return (
        <ScrollView>
            <Image style={styles.image} source={{ uri: member.imageUrl }} />
            <View style={styles.detailContainer}>
                <AppText style={styles.title}>{member.firstName} {member.lastName}</AppText>
                <View style={styles.iconContainer}>
                    <Icon name="briefcase" size={30} iconColor={colors.secondary} bgColor="transparent" />
                    <AppText style={styles.subtitle}>{member.profession}</AppText>
                </View>
                <View style={styles.iconContainer}>
                    <Icon name="cellphone" size={30} iconColor={colors.secondary} bgColor="transparent" />
                    <AppText style={styles.subtitle}>{member.mobile}</AppText>
                </View>
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
        color: colors.secondary,
        fontSize: 20,
        fontWeight: '500',
        marginVertical: 7,
    }
});

export default MemberDetailsScreen;