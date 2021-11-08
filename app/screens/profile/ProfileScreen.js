import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import Screen from '../../components/Screen';
import AppText from '../../components/AppText';
import AppButton from '../../components/AppButton';
import authStorage from '../../auth/storage';
import useAuth from '../../auth/useAuth';
import globalVariables from '../../globalVariables';
import colors from '../../config/colors';
import ListItem from '../../components/list/ListItem';
import Icon from '../../components/Icon';
import routes from '../../navigation/routes';

function ProfileScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            authStorage.getUser().then(data => {
                setUserData({ ...data });
            }).catch(error => console.log(error));
        });
        return unsubscribe;
    }, [navigation]);

    const { logout } = useAuth();

    return (
        <ScrollView>
            <View style={styles.container}>
                {userData?.photoUrl && <Image style={styles.profilePic} source={{ uri: globalVariables.IMAGE_BASE + userData.photoUrl }} />}
                <AppText style={styles.title}>{userData?.firstName} {userData?.lastName}</AppText>
                <ListItem
                    style={styles.listItem}
                    title="Edit Profile"
                    IconComponent={<Icon name="pencil" bgColor={colors.secondary} />}
                    onPress={() => navigation.navigate(routes.EDITPROFILE, { currentUser: userData })} />
                <ListItem
                    style={styles.listItem}
                    title="Change Password"
                    IconComponent={<Icon name="key" bgColor={colors.danger} />}
                    onPress={() => navigation.navigate(routes.CHANGE_PASSWORD)} />

                <ListItem
                    title="Log Out"
                    IconComponent={
                        <Icon name="logout" bgColor={colors.lightYellow} />
                    }
                    onPress={logout}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        width: '100%',
        padding: 15
    },
    profilePic: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderColor: colors.white,
        borderWidth: 5,
        alignSelf: 'center',
        marginBottom: 10,
        marginTop: 40
    },
    listItem: {
        marginBottom: 10
    },
    title: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.mediumGray,
        marginBottom: 10
    }
});

export default ProfileScreen;