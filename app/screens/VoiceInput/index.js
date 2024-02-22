import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  Button,
  TouchableOpacity,
} from 'react-native';
import Voice from '@react-native-voice/voice';
import { BaseColors } from '@config/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderBar from '@components/HeaderBar';
import styles from './styles';
import { useSelector } from 'react-redux';

const VoiceInput = () => {
  const { darkmode } = useSelector(state => state.auth);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    // Initialize voice recognition
    Voice.onSpeechStart = () => {
      console.log('Speech started');
    };

    Voice.onSpeechRecognized = e => {
      console.log('Speech recognized', e);
    };

    Voice.onSpeechResults = e => {
      const recognized = e.value[0];
      setRecognizedText(recognized);
      console.log('Speech results', recognized);
    };

    Voice.onSpeechEnd = () => {
      console.log('Speech ended');
    };

    Voice.onSpeechError = e => {
      console.log('Speech error', e);
    };

    return () => {
      // Clean up event listeners
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (e) {
      console.error('Error starting voice recognition', e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.destroy();
      setIsListening(false);
    } catch (e) {
      console.error('Error stopping voice recognition', e);
    }
  };

  const words = recognizedText.split(' ');
  const capitalizedWords = words.map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  const capitalizedFirstFiveWords = capitalizedWords
    .slice(0, 5)
    .join(' ')
    .replace(/\s+/g, '\n');

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: darkmode ? BaseColors.lightBlack : BaseColors.white,
        },
      ]}
    >
      <HeaderBar HeaderText={'Voice Input'} HeaderCenter leftText="Back" />
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={styles.text}>{capitalizedFirstFiveWords}</Text>
          <TouchableOpacity
            onPress={isListening ? stopListening : startListening}
            style={[
              styles.borderVoice,
              {
                borderColor: darkmode ? BaseColors.white : BaseColors.black10,
                backgroundColor: darkmode
                  ? BaseColors.textColor
                  : BaseColors.white,
                elevation: darkmode ? 0 : 2,
              },
            ]}
          >
            <Icon
              size={65}
              name="microphone"
              color={isListening ? BaseColors.red : BaseColors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textInput}
            onPress={() => {
              stopListening();
              setRecognizedText('');
            }}
          >
            <Text
              style={{
                color: darkmode ? BaseColors.white : BaseColors.primary,
                fontSize: 14,
              }}
            >
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default VoiceInput;
