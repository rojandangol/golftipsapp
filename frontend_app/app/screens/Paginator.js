import { StyleSheet, View } from 'react-native';
import React from 'react';

const Paginator = ({ data }) => {
  return (
    <View style={{ flexDirection: 'row', height: 64 }}>
      {data.map((_, i) => (
        <View style={[styles.dot, { width: 10 }]} key={i.toString()} />
      ))}
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#493d8a',
    marginHorizontal: 8,
  },
});
