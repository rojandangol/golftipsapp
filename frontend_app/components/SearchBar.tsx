import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, Button } from 'react-native';
import SearchIcon from './SearchIcon';
import Fuse from 'fuse.js';
import TipBoxes from './TipBoxes';
import { colors } from '@/constants/colors';


interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  data: Array<{ [key: string]: any }>;
  searchKeys: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', value, onChangeText, data, searchKeys }) => {
  const [filteredResults, setFilteredResults] = useState(data);
  const [inputValue, setInputValue] = useState(value);

  const handleSearch = () => {
    if (inputValue.trim() === '') {
      onChangeText(inputValue);
      setFilteredResults([]);
      return;
    }
    onChangeText(inputValue);

    const fuse = new Fuse(data, { keys: searchKeys, threshold: 0.3 });
    const results = fuse.search(inputValue).map(result => result.item);
    setFilteredResults(results);
  };

  return (
    <View>
      <View style={styles.container}>
        <SearchIcon size={40} color="#00695B" />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#000"
          value={inputValue}
          onChangeText={setInputValue}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      {filteredResults.map((item, index) => (
          <TipBoxes key={index} title={item.title} body={item.details} ytlink={item.ytlink} read="Read More" />
      ))}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 20,
    color: '#000',
  },
  resultItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SearchBar;
