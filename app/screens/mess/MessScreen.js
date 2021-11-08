import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import AppButton from '../../components/AppButton';
import useAuth from '../../auth/useAuth';
import CreateJoin from '../../components/mess/CreateJoin';
import MessMenu from '../../components/mess/MessMenu';

function MessScreen({ route, navigation }) {
    const [messOption, setMessOption] = useState();
    const [messId, setMessId] = useState(0);
    const { decodedToken, token } = useAuth();

    useEffect(() => {
        intializeMessOption();
    }, [token]);

    const intializeMessOption = async () => {
        const option = await decodedToken();
        if (option) {
            setMessId(parseInt(option.MessId));
            setMessOption(option);
            navigation.setOptions({
                title: option.MessId > 0 ? 'Mess Menu' : 'Create/Join Mess'
            });
        }
    }

    return (
        <View>
            {(messOption && messOption.isMobileVerified == "verified" && messId > 0) ?
                <MessMenu /> :
                <CreateJoin title="Create/Join Mess" />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    }
});

export default MessScreen;