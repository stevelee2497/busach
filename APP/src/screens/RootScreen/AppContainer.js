import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import SignInScreen from '../SignInScreen';
import SignUpScreen from '../SignUpScreen';
import BottomTabBar from './BottomTabBar';
import CatalogScreen from '../CatalogScreen';
import ChapterDetailScreen from '../ChapterDetailScreen';
import BookDetailScreen from '../BookDetailScreen';
import BookCollectionScreen from '../BookCollectionScreen';

const AppStacks = createStackNavigator(
  {
    BottomTabBar,
    BookCollectionScreen,
    BookDetailScreen,
    CatalogScreen,
    ChapterDetailScreen
  },
  {
    initialRouteName: 'BottomTabBar',
    headerMode: 'screen'
  }
);

const AuthStacks = createStackNavigator(
  {
    SignInScreen,
    SignUpScreen,
  },
  {
    initialRouteName: 'SignInScreen',
  }
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AppStacks,
      AuthStacks,
    },
    {
      initialRouteName: 'AppStacks',
    }
  )
);

export default AppContainer;
