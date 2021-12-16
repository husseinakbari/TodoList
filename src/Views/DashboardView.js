import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import SafeView from '../components/SafeView';
import {colors} from '../themes';
import {screenName} from '../utils/constans';

const DashboardPage = ({navigation}) => {
  return (
    <SafeView>
      <View style={styles.screen}>
        <Pressable onPress={() => navigation.navigate(screenName.create)}>
          <Text style={styles.title}>Dashboard Page</Text>
        </Pressable>
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

export default DashboardPage;