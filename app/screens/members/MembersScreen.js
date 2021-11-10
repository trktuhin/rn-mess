import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import routes from '../../navigation/routes';
import IconButton from '../../components/IconButton';
import colors from '../../config/colors';
import useAuth from '../../auth/useAuth';
import AppButton from '../../components/AppButton';
import memberApi from '../../api/member';
import ListItem from '../../components/list/ListItem';
import globalVariables from '../../globalVariables';
import ListItemSeparator from '../../components/list/ListItemSeparator';

function MembersScreen({ navigation }) {
    const [messOption, setMessOption] = useState();
    const [members, setMembers] = useState([]);
    const { decodedToken, token } = useAuth();
    useEffect(() => {
        decodedToken().then((option) => {
            //console.log("Mess Options", option);
            setMessOption(option);
            if (option.messRole == "admin") {
                navigation.setOptions({
                    headerRight: () => <IconButton name="plus" bgColor={colors.primary} onPress={() => navigation.navigate(routes.NEWEDITMEMBER, { id: 0 })} />
                });
            }
        }).catch((err) => console.log(err));

    }, [token]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            initializeMembers();
        });
        return unsubscribe;
    }, [navigation]);

    const initializeMembers = async () => {
        // here only fetch member
        const response = await memberApi.getMembers();
        if (!response.ok) {
            return alert('Could not fetch members');
        }
        setMembers(response.data);
    }

    return (
        <View style={styles.container}>
            {messOption && (parseInt(messOption.MessId) === 0) &&
                (<View>
                    <AppButton title="Create or Join Mess" onPress={() => navigation.navigate(routes.MESS)} />
                </View>)}

            {members.length > 0 && (
                <View>
                    <FlatList data={members}
                        keyExtractor={member => member.id.toString()}
                        ItemSeparatorComponent={ListItemSeparator}
                        renderItem={({ item }) => <ListItem
                            title={item.firstName + ' ' + item.lastName}
                            subtitle={item.mobile ? item.mobile : 'Manual'}
                            image={item.photoName ? { uri: globalVariables.IMAGE_BASE + item.photoName } : require("../../assets/defaultuser.jpg")}
                            onPress={() => navigation.navigate(routes.MEMBERDETAILS, { member: item })} />} />
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 15
    }
});

export default MembersScreen;