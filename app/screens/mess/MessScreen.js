import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import useAuth from '../../auth/useAuth';
import CreateJoin from '../../components/mess/CreateJoin';
import MessMenu from '../../components/mess/MessMenu';
import ActivityIndication from '../../components/ActivityIndicator';

function MessScreen({ route, navigation }) {
    const [messOption, setMessOption] = useState();
    const [messId, setMessId] = useState(0);
    const [loading, setLoading] = useState(true);
    const { decodedToken, token } = useAuth();

    useEffect(() => {
        let isCancelled = false;
        intializeMessOption();
        setLoading(false);
        return () => {
            isCancelled = true;
        };
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
        <>
            {loading && <ActivityIndication visible={loading} />}
            {messOption && <View>
                {(messOption.isMobileVerified == "verified" && messId > 0) ?
                    <MessMenu /> :
                    <CreateJoin title="Create/Join Mess" />
                }
            </View>}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    }
});

export default MessScreen;