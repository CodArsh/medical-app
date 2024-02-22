import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';

const MultiSelect = ({
  items,
  selectedItems,
  onSelectionChange,
  placeholder,
  showError,
  errorText,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { darkmode } = useSelector(state => state.auth);

  const toggleItem = item => {
    const selectedIndex = selectedItems.findIndex(
      selectedItem => selectedItem.id === item.id,
    );
    let newSelectedItems = [];

    if (selectedIndex === -1) {
      newSelectedItems = [...selectedItems, item];
    } else {
      newSelectedItems = selectedItems.filter(
        selectedItem => selectedItem.id !== item.id,
      );
    }

    onSelectionChange(newSelectedItems);
  };

  // Filter items based on search term
  const filteredItems = items?.filter(item =>
    item?.sport_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={{ padding: 10 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={{
              color: darkmode ? BaseColors.white : BaseColors.black50,
              fontFamily: FontFamily.regular,
            }}
          >
            {selectedItems.length > 0
              ? selectedItems.map(item => item.sport_name).join(', ')
              : placeholder}
          </Text>
          <Icon1
            name={expanded ? 'up' : 'down'}
            size={16}
            color={BaseColors.textColor}
          />
        </View>
      </TouchableOpacity>
      <ScrollView style={{ overflow: 'scroll' }}>
        {expanded && (
          <View style={{ backgroundColor: '#ffffff', padding: 10 }}>
            <TextInput
              placeholder="Search..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                padding: 8,
                marginBottom: 10,
              }}
            />
            {filteredItems?.map(item => (
              <TouchableOpacity
                key={item?.id}
                onPress={() => toggleItem(item)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                }}
              >
                <Icon
                  name={
                    selectedItems.some(
                      selectedItem => selectedItem.id === item.id,
                    )
                      ? 'check-square'
                      : 'square'
                  }
                  size={20}
                  color={BaseColors.primary}
                />
                <Text style={{ marginLeft: 10 }}>{item?.sport_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      {showError && <Text style={{ color: BaseColors.red }}>{errorText}</Text>}
    </View>
  );
};

export default MultiSelect;
