import Button from '@components/Button';
import { BaseColors, FontFamily } from '@config/theme';
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';

const YearPicker = ({ visible, onSelect, onClose }) => {
  const { darkmode } = useSelector(state => state.auth);
  const [activeVal, setActiveVal] = useState('');
  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = currentYear; year >= currentYear - 100; year--) {
      yearsArray.push(year);
    }
    return yearsArray;
  }, []);

  const handleYearSelect = year => {
    onSelect(year);
    setActiveVal(year);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent
      animated
    >
      <TouchableWithoutFeedback
        onPress={() => {
          onClose();
        }}
      >
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback
            onPress={e => {
              return null;
            }}
          >
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: darkmode
                    ? BaseColors.black
                    : BaseColors.white,
                },
              ]}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: BaseColors.primary,
                }}
              >
                <Text
                  style={{
                    color: BaseColors.primary,
                    fontFamily: FontFamily.bold,
                    textAlign: 'center',
                  }}
                >
                  Year Picker
                </Text>
              </View>
              <FlatList
                data={years}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text
                    style={[
                      styles.yearText,
                      {
                        backgroundColor:
                          item === activeVal
                            ? BaseColors.primary
                            : BaseColors.transparent,
                        color:
                          item === activeVal
                            ? BaseColors.white
                            : darkmode
                            ? BaseColors.white
                            : BaseColors.textColor,
                      },
                    ]}
                    onPress={() => handleYearSelect(item)}
                  >
                    {item}
                  </Text>
                )}
                numColumns={5}
              />
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  activeOpacity={0.7}
                  onPress={() => {
                    onClose();
                  }}
                >
                  <Text style={{ color: BaseColors.white }}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    padding: 20,
    borderRadius: 12,
    maxHeight: '60%',
    elevation: 40,
  },

  yearText: {
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    borderRadius: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelBtn: {
    marginRight: 5,
    padding: 8,
    backgroundColor: BaseColors.primary,
    borderRadius: 8,
  },
});

export default YearPicker;
