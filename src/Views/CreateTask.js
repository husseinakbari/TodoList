import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SafeView from '../components/SafeView';
import {colors} from '../themes';

const CreateTask = () => {
  return (
    <SafeView>
      <View style={styles.screen}>
        <Text style={styles.title}>CreateTask Page</Text>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 12,
    color: colors.black,
  },
});

export default CreateTask;