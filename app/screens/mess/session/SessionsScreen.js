import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import dateFormat from "dateformat";

import useAuth from '../../../auth/useAuth';
import IconButton from '../../../components/IconButton';
import colors from '../../../config/colors';
import sessionApi from '../../../api/session';
import ListItem from '../../../components/list/ListItem';
import ListItemSeparator from '../../../components/list/ListItemSeparator';
import ActivityIndication from '../../../components/ActivityIndicator';
import routes from '../../../navigation/routes';
import AppText from '../../../components/AppText';
import useIsMounted from '../../../hooks/useIsMounted';

function SessionsScreen({ navigation }) {
    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sessions, setSessions] = useState([]);
    const { decodedToken } = useAuth();

    const getMediumDate = (fullDate) => {
        const date = new Date(fullDate);
        return dateFormat(date, "dd mmmm yyyy");
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            decodedToken().then((option) => {
                if (option.messRole == "admin") {
                    navigation.setOptions({
                        headerRight: () => <IconButton name="plus" bgColor={colors.primary} onPress={() => navigation.navigate(routes.NEWEDITSESSION, { id: 0 })} />
                    });
                }
            }).catch((err) => console.log(err));

            sessionApi.getSessions().then(res => {
                if (isMounted.current) setSessions(res.data);
            }).catch((_) => console.log('Could not get sessions.'))
                .finally((_) => { if (isMounted.current) setLoading(false); });
        });
        return unsubscribe;
    }, [navigation]);

    const fetchSessions = () => {
        sessionApi.getSessions().then(res => {
            setSessions(res.data);
        }).catch((_) => console.log('Could not get sessions.'))
            .finally((_) => { if (isMounted.current) setLoading(false); });
    }

    return (<>
        {loading && <ActivityIndication visible={loading} />}
        <View style={styles.container}>
            <View style={styles.flatListContainer}>
                {sessions.length > 0 && (
                    <FlatList data={sessions}
                        keyExtractor={session => session.id.toString()}
                        ItemSeparatorComponent={ListItemSeparator}
                        refreshing={refreshing}
                        onRefresh={() => fetchSessions()}
                        renderItem={({ item }) => <ListItem
                            title={item.title}
                            subtitle={getMediumDate(item.sessionStart) + ' - ' + getMediumDate(item.sessionEnd)}
                            onPress={() => navigation.navigate(routes.NEWEDITSESSION, { id: item.id, currentSession: item })} />} />
                )}</View>
            {!loading && (sessions.length === 0) &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <AppText>No Sessions Found.</AppText>
                </View>}
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
    flatListContainer: {
        flex: 1,
    }
});

export default SessionsScreen;