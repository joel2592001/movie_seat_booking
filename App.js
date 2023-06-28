import { StyleSheet } from 'react-native';
import Main_page from './Main_page';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Loginscreen from './loginscreen';
import Registerscreen from './registerscreen';
import Admin from './Admin';

const stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator initialRouteName='Admin' screenOptions={{headerShown:false}}>
          <stack.Screen name="Loginscreen" component={Loginscreen} />
          <stack.Screen name="Registerscreen" component={Registerscreen}/>
          <stack.Screen name="Main" component={Main_page}/>
          <stack.Screen name="Admin" component={Admin}/>
      </stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
