import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import images from '../../helpers/imageHelper';

class ProfileScreen extends Component {
  static navigationOptions = {
    title: 'Hồ sơ',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={images.circleUser}
        style={{
          width: 18, height: 18, tintColor, marginTop: 6,
        }}
        resizeMode="stretch"
      />
    ),
  };

  render() {
    return (
      <View>
        <Text> ProfileScreen </Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);
