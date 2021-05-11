import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { Input, Button } from 'react-native-elements';

const Home = () => {
  const [url, onChangeUrl] = useState('');
  const [count, onChangeCount] = useState('1');
  const [results, setResults] = useState([]);
  const [spinner, setSpinner] = useState(false);

  const inputURL = React.createRef();
  const inputCount = React.createRef();

  const onPress = async () => {
    // input control
    console.log(url);
    if (!url) {
      inputURL.current.shake();
      return;
    }
    if (!count) {
      inputCount.current.shake();
      return;
    }

    setSpinner(true);
    const req = async () => {
      try {
        return await axios(url);
      } catch (err) {
        return err.isAxiosError ? err.response : console.error(err) && err;
      }
    };

    const promises = [];
    for (let i = 0; i < +count; i++) {
      promises.push(req());
    }

    try {
      const res = await Promise.all(promises);
      const list = [];
      res.forEach(r => (list[r.status] = ++list[r.status] || 1));
      setResults(list);
    } catch (err) {
      console.error(err);
    } finally {
      setSpinner(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <View>
        <Input
          ref={inputURL}
          label="URL"
          placeholder="https://example.com"
          onChangeText={onChangeUrl}
          value={url}
        />
        <Input
          ref={inputCount}
          label="Request Count"
          placeholder="Request Count"
          onChangeText={onChangeCount}
          value={count}
          keyboardType="numeric"
        />
        <Button onPress={onPress} title="Send Requests" />
      </View>

      {/* RESPONSE DETAIL */}
      {results.length ? (
        <Text style={styles.responseTitle}>RESPONSES</Text>
      ) : null}
      <ScrollView>
        {results.map((item, status) => (
          <Text
            style={[
              styles.itemText,
              status === 200 ? { color: 'green' } : { color: 'red' },
            ]}>
            {item} requests = {status}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  responseTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 30,
  },
  itemView: {},
  itemText: { fontSize: 20, marginTop: 10 },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
