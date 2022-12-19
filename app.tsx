import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { oauth, net } from 'react-native-force';

interface Response {
    records: Record[]
}

interface Record {
    Id: String,
    Name: String
}

interface Props {
}
  
interface State {
    data : Record[] 
}

class ContactListScreen extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props);
        this.state = {data: []};
    }
    
    componentDidMount() {
        var that = this;
        oauth.getAuthCredentials(
            () => that.fetchData(), // already logged in
            () => {
                oauth.authenticate(
                    () => that.fetchData(),
                    (error) => console.log('Failed to authenticate:' + error)
                );
            });
    }

    fetchData() {
        var that = this;
        net.query('SELECT Id, Name FROM Contact LIMIT 100',
                  (response:Response) => that.setState({data: response.records}),
                  (error) => console.log('Failed to query:' + error)
                 );
    }

    render() {
        return (
            <View style={styles.container}>
              <FlatList
                data={this.state.data}
                renderItem={({item}) => <Text style={styles.item}>{item.Name}</Text>}
                keyExtractor={(item, index) => 'key_' + index}
              />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        backgroundColor: 'white',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        backgroundColor: 'red'
    }
});

const Stack = createStackNavigator();

export const App = function() {
    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="My First App" component={ContactListScreen} />
          </Stack.Navigator>
        </NavigationContainer>
    );
}
