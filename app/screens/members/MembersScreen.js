import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import ListItem from '../../components/list/ListItem';
import ListItemSeparator from '../../components/list/ListItemSeparator';
import routes from '../../navigation/routes';

const members = [
    {
        id: 1,
        firstName: 'Robin',
        lastName: 'Khan',
        imageUrl: 'https://e7.pngegg.com/pngimages/643/98/png-clipart-computer-icons-avatar-mover-business-flat-design-corporate-elderly-care-microphone-heroes-thumbnail.png',
        mobile: '01677048891',
        profession: 'Software Engineer'
    },
    {
        id: 2,
        firstName: 'Aamir',
        lastName: 'Khan',
        imageUrl: 'https://e7.pngegg.com/pngimages/643/98/png-clipart-computer-icons-avatar-mover-business-flat-design-corporate-elderly-care-microphone-heroes-thumbnail.png',
        mobile: '01677048892',
        profession: 'Actor'
    },
    {
        id: 3,
        firstName: 'Sharif',
        lastName: 'Khan',
        imageUrl: 'https://e7.pngegg.com/pngimages/643/98/png-clipart-computer-icons-avatar-mover-business-flat-design-corporate-elderly-care-microphone-heroes-thumbnail.png',
        mobile: '01677048893',
        profession: 'Biologist'
    }
];

function MembersScreen({ navigation }) {
    return (
        <View>
            <FlatList data={members}
                keyExtractor={member => member.id.toString()}
                ItemSeparatorComponent={ListItemSeparator}
                renderItem={({ item }) => <ListItem
                    title={item.firstName + ' ' + item.lastName}
                    subtitle={item.mobile}
                    image={{ uri: item.imageUrl }}
                    onPress={() => navigation.navigate(routes.MEMBERDETAILS, { member: item })} />} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {}
});

export default MembersScreen;