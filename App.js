import * as React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Button, Pressable, Modal, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getWeather= async (lat, long) => {
     try {
      const myLat = lat;
      const myLong = long;
      const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat='+myLat+'&lon='+myLong+'&appid=d339b378743357cd4befe21094335f5d&units=metric');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      let lat = location.coords.latitude;
      let long = location.coords.longitude;
      getWeather(lat, long);
      setLat(lat);
      setLong(long);
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  let txtLat = "";
  let txtLong = "";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    txtLat = JSON.stringify(lat);
    txtLong = JSON.stringify(long);
  }
  return (
    <View style={styles.container}>
      <MapView style={styles.map}
      showsUserLocation={true}
      region={location}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {isLoading ? <ActivityIndicator/> : (
        <View>
          <Text>
            Place: {data.name}
          </Text>
          <Text>
            Latitude: {lat}
          </Text>
          <Text>
            Longitude: {long}
          </Text>
          <Text>
            Temperature: {data.main.temp}
          </Text>
          <Text>
            Pressure: {data.main.pressure}
          </Text>
          <Text>
            Humidity: {data.main.humidity}
          </Text>
          <Text>
            Description: {data.weather[0].description}
          </Text>
        </View>
      )}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalView: {
    margin: 20,
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    position: "absolute",
    bottom: 30,
    left: 2,
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});