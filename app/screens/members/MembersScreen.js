import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Modal, Text, Pressable } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import routes from '../../navigation/routes';
import IconButton from '../../components/IconButton';
import colors from '../../config/colors';
import useAuth from '../../auth/useAuth';
import AppButton from '../../components/AppButton';
import memberApi from '../../api/member';
import ListItem from '../../components/list/ListItem';
import globalVariables from '../../globalVariables';
import ListItemSeparator from '../../components/list/ListItemSeparator';
import ActivityIndication from '../../components/ActivityIndicator';
import TabButton from '../../components/TabButton';
import MemberRequestList from '../../components/member/MemberRequestList';
import AppText from '../../components/AppText';
import DefaultTextButton from '../../components/DefaultTextButton';


function MembersScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [messOption, setMessOption] = useState();
    const [members, setMembers] = useState([]);
    const [memberRequests, setmemberRequests] = useState([]);
    const [memberTab, setMemberTab] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [requestedMember, setrequestedMember] = useState(null);
    const [replacedMemberId, setreplacedMemberId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const { decodedToken, token, recievedRequest, setRecievedRequest } = useAuth();

    useEffect(() => {
        let isCancelled = false;
        if (!isCancelled) {
            if (recievedRequest == false) {
                return;
            }
            initializeMemberRequests();
            if (recievedRequest == true) {
                setRecievedRequest(false);
            }
        }
        return () => {
            isCancelled = true;
        };
    }, [recievedRequest]);

    useEffect(() => {
        let isCancelled = false;
        decodedToken().then((option) => {
            setMessOption(option);
            if (option.messRole == "admin") {
                setIsAdmin(true);
                navigation.setOptions({
                    headerRight: () => <IconButton name="plus" bgColor={colors.primary} onPress={() => navigation.navigate(routes.NEWEDITMEMBER, { id: 0 })} />
                });
            }
            initializeMembers();
        }).catch((err) => console.log(err));
        return () => {
            isCancelled = true;
        };
    }, [token]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            initializeMembers();
        });
        return unsubscribe;
    }, [navigation]);



    const initializeMembers = async () => {
        setLoading(true);
        const response = await memberApi.getMembers();
        if (!response.ok) {
            return alert('Could not fetch members');
        }
        setMembers(response.data);
        setLoading(false);
    }

    const initializeMemberRequests = async () => {
        setLoading(true);
        let resp;
        const response = await memberApi.getMemberRequests();
        if (!response.ok) {
            return;
        }
        setmemberRequests(response.data);
        setLoading(false);
    }

    const isMemberTab = (value) => {
        if (value === true) {
            initializeMembers();
            setMemberTab(true);
        }
        else {
            initializeMemberRequests();
            setMemberTab(false);
        }
    }

    const handleDeleteRequest = (userId) => {
        Alert.alert('Are you sure?', 'The request will be deleted but can send you request again.',
            [
                { text: 'Cancel' },
                {
                    text: 'Yes', onPress: () => {
                        setLoading(true);
                        memberApi.deleteRequest(userId).then((response) => {
                            if (!response.ok) {
                                return alert(response?.data ? response.data : 'Could not delete request');
                            }
                            isMemberTab(false);
                        }).catch((err) => console.log(err)).finally(() => setLoading(false))
                    }
                }
            ]);
    }

    const handleAcceptNewMember = (userId) => {
        Alert.alert('Are you sure?', 'A new member will be added.',
            [
                { text: 'Cancel' },
                {
                    text: 'Yes', onPress: () => {
                        setLoading(true);
                        memberApi.approveNewRequst(userId).then((response) => {
                            if (!response.ok) {
                                return alert(response?.data ? response.data : 'Could not accept request');
                            }
                            isMemberTab(true);
                        }).catch((err) => console.log(err)).finally(() => setLoading(false))
                    }
                }
            ]);
    }

    const handleOpenModal = (user) => {
        setrequestedMember(user);
        setModalVisible(true);
    }

    const handleReplaceMember = () => {
        if (replacedMemberId == null) {
            return alert('Please select a member to replace');
        }
        setLoading(true);
        const model = {
            userId: requestedMember.userId,
            memberId: replacedMemberId
        };
        memberApi.replaceMember(model).then((response) => {
            if (!response.ok) {
                return alert(response?.data ? response.data : 'Could not replace member');
            }
            setModalVisible(false);
            isMemberTab(true);
        }).catch((err) => console.log(err)).finally(() => setLoading(false))
    }

    return (
        <>{loading && <ActivityIndication visible={loading} />}
            <View style={styles.container}>
                {messOption && (parseInt(messOption.MessId) === 0) &&
                    (<View>
                        <AppButton title="Create or Join Mess" onPress={() => navigation.navigate(routes.MESS)} />
                    </View>)}

                {messOption?.MessId > 0 && <View style={styles.tabContainer}>
                    <View style={styles.tabButtonContainer}>
                        <TabButton onPress={() => isMemberTab(true)} isActive={memberTab} title="Active Members" />
                    </View>
                    <View style={styles.tabButtonContainer}>
                        <TabButton onPress={() => isMemberTab(false)} isActive={!memberTab} title="Member Requests" />
                    </View>
                </View>}
                {memberTab && members.length > 0 && (
                    <View style={styles.flatListContainer}>
                        <FlatList data={members}
                            keyExtractor={member => member.id.toString()}
                            ItemSeparatorComponent={ListItemSeparator}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => <ListItem
                                title={item.firstName + ' ' + item.lastName}
                                subtitle={item.mobile ? item.mobile : 'Manual'}
                                image={item.photoName ? { uri: globalVariables.IMAGE_BASE + item.photoName } : require("../../assets/defaultuser.jpg")}
                                onPress={() => navigation.navigate(routes.MEMBERDETAILS, { member: item })} />} />
                    </View>
                )}
                {!memberTab && memberRequests.length === 0 &&
                    <View style={styles.NoDataContainer}>
                        <AppText>No member requests found</AppText>
                    </View>
                }
                {(!memberTab && memberRequests.length > 0) && (
                    <>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <AppText style={styles.hintModal}>{`${requestedMember?.firstName} ${requestedMember?.lastName}`} will replace the member you select.</AppText>
                                    <RNPickerSelect
                                        onValueChange={(value) => setreplacedMemberId(value)}
                                        placeholder={{
                                            label: 'Select a member',
                                            value: null,
                                            color: colors.primary,
                                        }}
                                        items={members.map((member) => {
                                            return {
                                                label: `${member.firstName} ${member.lastName}`,
                                                value: `${member.id}`
                                            }
                                        })
                                        }
                                        style={pickerSelectStyles}
                                    />
                                    <View style={styles.modalFooterButton}>
                                        <DefaultTextButton title="Close" bgColor="mediumGray" onPress={() => setModalVisible(false)} />
                                        <DefaultTextButton title="Replace Member" bgColor="primary" onPress={() => handleReplaceMember()} />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <View style={styles.flatListContainer}>
                            <FlatList data={memberRequests}
                                keyExtractor={mr => mr.id.toString()}
                                ItemSeparatorComponent={ListItemSeparator}
                                renderItem={({ item }) => <MemberRequestList
                                    name={`${item.user.firstName} ${item.user.lastName}`}
                                    image={item.user.photoUrl ? { uri: globalVariables.IMAGE_BASE + item.user.photoUrl } : require("../../assets/defaultuser.jpg")}
                                    onDeleteMember={() => handleDeleteRequest(item.user.userId)}
                                    onNewMember={() => handleAcceptNewMember(item.user.userId)}
                                    onExistingMember={() => handleOpenModal(item.user)}
                                    isAdmin={isAdmin}
                                />} />
                        </View>
                    </>
                )}
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingBottom: 0
    },
    tabContainer: {
        flexDirection: 'row',
    },
    tabButtonContainer: {
        flex: 1,
        marginBottom: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 10,
        width: '80%',
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalFooterButton: {
        flexDirection: 'row',
        marginTop: 10,
        width: '100%',
        justifyContent: 'flex-end'
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    hintModal: {
        marginVertical: 10,
        color: colors.mediumGray,
    },
    NoDataContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingBottom: 150,
    },
    flatListContainer: {
        flex: 1
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default MembersScreen;