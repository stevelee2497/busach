import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

class SignUpScreen extends Component {
  render() {
    return (
      <View>
        <Text> SignUpScreen </Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen);
