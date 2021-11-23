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
import useAuth from '../../auth/useAuth';
import DefaultTextButton from '../../components/DefaultTextButton';

function MemberDetailsScreen({ route, navigation }) {
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [isManual, setIsManual] = useState(true);
    const [ownMemberShip, setOwnMembership] = useState(false);
    const { decodedToken } = useAuth();
    const member = route.params.member;

    useLayoutEffect(() => {
        decodedToken().then(option => {
            if (member.userId !== null) {
                setIsManual(false);
            }
            if (option?.messRole == "admin") {
                setIsAdmin(true);
            }
            if (member.messRole == "manager") {
                setIsManager(true);
            }
            if (option?.nameid == member?.userId) {
                setOwnMembership(true);
            }
            if ((member?.userId == null && option?.messRole == "admin") || option?.nameid == member?.userId) {
                navigation.setOptions({
                    headerRight: () => (
                        <IconButton name='pencil' bgColor={colors.primary} onPress={() => navigation.navigate(routes.NEWEDITMEMBER,
                            {
                                id: member.id,
                                isManualMember: member?.userId == null
                            })} />
                    ),
                });
            }
        }).catch(err => console.log(err));

    }, [navigation]);

    const handleMakeManager = () => {
        Alert.alert('Are you sure?', `${member.firstName} will have the power of a manager.`, [
            { text: 'Cancel' },
            {
                text: 'Yes',
                onPress: () => {
                    setLoading(true);
                    memberApi.makeManager(member.id).then((response) => {
                        if (!response.ok) {
                            return alert(response?.data ? response.data : 'Could not make manager');
                        }
                        navigation.pop();
                    }).catch((err) => console.log(err)).finally(() => setLoading(false));
                }
            }
        ]);
    }

    const handleRemoveManagership = () => {
        Alert.alert('Are you sure?', `${member.firstName} will be no longer a manager.`, [
            { text: 'Cancel' },
            {
                text: 'Yes',
                onPress: () => {
                    setLoading(true);
                    memberApi.deleteManagership(member.id).then((response) => {
                        if (!response.ok) {
                            return alert(response?.data ? response.data : 'Could not remove managership');
                        }
                        navigation.pop();
                    }).catch((err) => console.log(err)).finally(() => setLoading(false));
                }
            }
        ]);
    }

    const handleDelete = () => {
        Alert.alert('Are you sure?', `${member.firstName} will be deleted from your mess`,
            [
                { text: 'Cancel' },
                {
                    text: 'Yes', onPress: () => {
                        setLoading(true);
                        memberApi.deleteMember(member.id).then((response) => {
                            if (!response.ok) {
                                return alert(response?.data ? response.data : 'Could not delete member');
                            }
                            navigation.pop();
                        }).catch((err) => console.log(err)).finally(() => setLoading(false));
                    }
                }
            ]);
    }

    const handleRemoveMembership = () => {
        Alert.alert('Are you sure?', `You will be removed from this mess.`,
            [
                { text: 'Cancel' },
                {
                    text: 'Yes', onPress: () => {
                        setLoading(true);
                        memberApi.deleteMembership(member.id).then((response) => {
                            if (!response.ok) {
                                return alert(response?.data ? response.data : 'Could not delete member');
                            }
                            navigation.pop();
                        }).catch((err) => console.log(err)).finally(() => setLoading(false));

                    }
                }
            ]);
    }

    const handleViewMeals = () => {
        navigation.navigate(routes.VIEWMEALS, { member: member });
    }

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
                {member.email && <View style={styles.iconContainer}>
                    <Icon name="email" size={30} iconColor={colors.darkGary} bgColor="transparent" />
                    <AppText style={styles.subtitle}>{member.email}</AppText>
                </View>}
                <View style={styles.iconContainer}>
                    <Icon name="food-fork-drink" size={30} iconColor={colors.darkGary} bgColor="transparent" />
                    <AppText style={styles.subtitle}>({member.dBreakfast} + {member.dLunch} + {member.dDinner})</AppText>
                </View>
            </View>
            <View style={styles.bottomOptions}>
                {(!isManual && isAdmin && !isManager && !ownMemberShip) && <DefaultTextButton title="Make Manager" onPress={handleMakeManager} bgColor="darkYellow" />}
                {(isAdmin && isManager) && <DefaultTextButton title="Remove Managership" bgColor="danger" onPress={handleRemoveManagership} />}
                {(!isAdmin && ownMemberShip) && <DefaultTextButton title="Remove Membership" bgColor="danger" onPress={handleRemoveMembership} />}
                <IconButton onPress={handleViewMeals} name="food" bgColor={colors.mediumGray} />
                {(isAdmin && !ownMemberShip) && <IconButton name="trash-can" bgColor={colors.danger} onPress={handleDelete} />}
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
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
});

export default MemberDetailsScreen;