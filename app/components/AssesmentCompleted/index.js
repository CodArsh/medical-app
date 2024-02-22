import Button from '@components/Button';
import HeaderBar from '@components/HeaderBar';
import { BaseColors } from '@config/theme';
import React, { useState } from 'react';

import {
  View,
  StatusBar,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import styles from './styles';

export default function AssesmentCompleted({ navigation }) {
  const [textInputValue, setTextInputValue] = useState('');
  const IOS = Platform.OS === 'ios';
  const onTextInputChange = text => {
    setTextInputValue(text);
  };
  return (
    <KeyboardAvoidingView
      behavior={IOS ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* <StatusBar barStyle="dark-content" backgroundColor={BaseColors.white} />
        <HeaderBar HeaderText={'Symptoms'} HeaderCenter /> */}

        <View style={styles.mainDiv}>
          <View style={{ flex: 0.7 }}>
            <View style={{ marginBottom: 35 }}>
              <Text style={styles.titleText}>Assessment Completed</Text>
              <Text style={styles.subtitleText}>
                Thank you for completing your subsequent visit assessment.
              </Text>
            </View>

            <Text style={styles.subtitleText}>
              Any additional comments you would like to share with your
              provider?
            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                multiline
                placeholder="Share your comments..."
                value={textInputValue}
                onChangeText={onTextInputChange}
                style={styles.textInput}
                textAlignVertical="top"
              />
            </View>
          </View>
          <View style={[styles.buttoncontainer]}>
            <Button shape="round" title={'Done'} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
