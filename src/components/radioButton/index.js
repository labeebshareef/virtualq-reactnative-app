import React, {useState, useEffect} from 'react';
import {View, Text, Pressable} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default function RadioButton({data, onSelect}) {
  const [userOption, setUserOption] = useState(null);
  const selectHandler = value => {
    onSelect(value);
    setUserOption(value);
    console.log(userOption);
  };
  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  return (
    <View>
      {data.map(item => {
        return (
          <Pressable
            style={
              item.timeSlots._id === userOption
                ? styles.selected
                : styles.unselected
            }
            onPress={() => selectHandler(item.timeSlots._id)}>
            <Text style={styles.option}>
              {' '}
              {formatAMPM(new Date(item.timeSlots.startTime))}-
              {formatAMPM(new Date(item.timeSlots.endTime))} |
              {item.appointments.length
                ? item.appointments[0].remainingSlotsNumber
                : item.timeSlots.numberOfSlots}{' '}
              Slots Available
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = EStyleSheet.create({
  option: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  unselected: {
    backgroundColor: 'grey',
    margin: 5,
  },
  selected: {
    backgroundColor: '#2CB0EF',
    margin: 6,
    padding: 10,
    borderRadius: 10,
  },
});
