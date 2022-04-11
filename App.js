import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

const MIC_SIZE = 64;

const App = () => {
  const [started, setStarted] = useState(false);
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

  const animated = useRef(new Animated.Value(0)).current;
  const opacityA = useRef(new Animated.Value(1)).current;

  const onSpeechStart = e => {
    setStarted(true);
  };
  const onSpeechEnd = () => {
    setStarted(false);
    setEnd(true);
  };
  const onSpeechError = e => {
    setError(JSON.stringify(e.error));
  };
  const onSpeechResults = e => {
    setResults(e.value);
  };
  const onSpeechPartialResults = e => {
    setPartialResults(e.value);
  };
  const onSpeechVolumeChanged = e => {
    setPitch(e.value);
  };

  useEffect(() => {
    // const onSpeechStart = (e: any) => {
    //   console.log('onSpeechStart: ', e);
    //   this.setState({
    //     started: true,
    //   });
    // };
    //
    // const onSpeechRecognized = e => {
    //   console.log('onSpeechRecognized: ', e);
    //   // this.setState({
    //   //     recognized: '√',
    //   // });
    // };
    //
    // const onSpeechEnd = e => {
    //   console.log('onSpeechEnd: ', e);
    //   this.setState({
    //     started: false,
    //   });
    // };
    //
    // const onSpeechError = e => {
    //   console.log('onSpeechError: ', e);
    //   this.setState({
    //     started: false,
    //     error: JSON.stringify(e.error),
    //   });
    // };
    //
    // const onSpeechResults = e => {
    //   console.log('onSpeechResults-----', e.value);
    //   // if (e?.value?.length > 0) {
    //   //   // console.log('onSpeechResults: ', e?.value);
    //   //   this.setState(
    //   //     {
    //   //       started: false,
    //   //       results: e.value[0],
    //   //     },
    //   //     () => {
    //   //       this.props.onResult(e.value[0]);
    //   //     },
    //   //   );
    //   // }
    // };
    //
    // const onSpeechPartialResults = e => {
    //   console.log('onSpeechPartialResults: ', e);
    //   // this.setState({
    //   //     partialResults: e.value,
    //   // });
    // };

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startSpeechRecognizing = async () => {
    setPitch('');
    setError('');
    setStarted(false);
    setResults([]);
    setPartialResults([]);
    setEnd('');
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopSpeechRecognizing = async () => {
    try {
      await Voice.stop();
      setStarted(false);
    } catch (e) {
      console.error(e);
    }
  };

  const runAnimation = () => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(animated, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(opacityA, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  };

  const micButton = useCallback(() => {
    if (started) {
      //some function
      runAnimation();
      return (
        <TouchableOpacity
          onPress={stopSpeechRecognizing}
          style={{width: MIC_SIZE, height: MIC_SIZE}}>
          <Animated.View
            style={{
              width: MIC_SIZE,
              height: MIC_SIZE,
              borderRadius: MIC_SIZE / 2,
              backgroundColor: 'rgba(153,0,0,0.4)',
              marginBottom: 10,
              opacity: opacityA,
              transform: [
                {
                  scale: animated,
                },
              ],
            }}>
            <Image
              source={require('./assets/images/mic.png')}
              resizeMode={'contain'}
              style={{height: MIC_SIZE, width: MIC_SIZE}}
            />
          </Animated.View>
        </TouchableOpacity>
      );
    } else {
      //some function
      // this._stopAnimation();
      return (
        <TouchableOpacity
          onPress={startSpeechRecognizing}
          style={{
            width: MIC_SIZE,
            height: MIC_SIZE,
            borderRadius: MIC_SIZE / 2,
            backgroundColor: 'rgba(153,0,0,0.4)',
            marginBottom: 10,
          }}>
          <Image
            source={require('./assets/images/mic.png')}
            resizeMode={'contain'}
            style={{height: MIC_SIZE, width: MIC_SIZE}}
          />
        </TouchableOpacity>
      );
    }
  }, [started, runAnimation, opacityA, animated]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {partialResults.map((result, index) => {
          return <Text key={`partial-result-${index}`}>{result}</Text>;
        })}
      </View>
      <View style={styles.micContainer}>{micButton()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  inputContainer: {
    flexGrow: 1,
    backgroundColor: '#eeeeee',
  },
  micContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
