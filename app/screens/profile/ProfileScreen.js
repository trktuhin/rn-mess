import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';

import AppText from '../../components/AppText';
import authStorage from '../../auth/storage';
import useAuth from '../../auth/useAuth';
import globalVariables from '../../globalVariables';
import colors from '../../config/colors';
import ListItem from '../../components/list/ListItem';
import Icon from '../../components/Icon';
import routes from '../../navigation/routes';
import ActivityIndication from '../../components/ActivityIndicator';
import useIsMounted from '../../hooks/useIsMounted';

function ProfileScreen({ navigation }) {
    const isMounted = useIsMounted();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (isMounted.current) setLoading(true);
            authStorage.getUser().then(data => {
                if (isMounted.current) setUserData({ ...data });
            }).catch(error => console.log(error))
                .finally(() => { if (isMounted.current) setLoading(false); });
        });
        return unsubscribe;
    }, [navigation]);

    const { logout } = useAuth();
    const handleLogout = () => {
        // navigation.popToTop();
        logout();
    }

    return (
        <ScrollView>
            {loading && <ActivityIndication visible={loading} />}
            {userData && <View style={styles.container}>
                <Image style={styles.profilePic} source={(userData.photoUrl && userData.photoUrl !== "user.jpg") ? { uri: globalVariables.IMAGE_BASE + userData.photoUrl } : require("../../assets/defaultuser.jpg")} />

                <AppText style={styles.title}>{userData?.firstName} {userData?.lastName}</AppText>
                <ListItem
                    style={styles.listItem}
                    title="Edit Profile"
                    IconComponent={<Icon name="pencil" bgColor={colors.primary} />}
                    onPress={() => navigation.navigate(routes.EDITPROFILE, { currentUser: userData })} />
                <ListItem
                    style={styles.listItem}
                    title="Change Password"
                    IconComponent={<Icon name="key" bgColor={colors.mediumGray} />}
                    onPress={() => navigation.navigate(routes.CHANGE_PASSWORD)} />

                <ListItem
                    title="Log Out"
                    IconComponent={
                        <Icon name="logout" bgColor={colors.danger} />
                    }
                    onPress={handleLogout}
                />
            </View>}
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