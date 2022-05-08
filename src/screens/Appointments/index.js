import React, {useEffect} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {Http} from '../../services';

const AppointmentListScreen = ({navigation}) => {
  const [appointmentList, setAppointmentlist] = React.useState([]);
  const [visible, setVisible] = React.useState(true);

  useEffect(() => {
    DeviceEventEmitter.addListener('data', data => {
      getAppointmentList();
    });
    const unsubscribe = navigation.addListener('focus', () => {
      getAppointmentList();
    });
    return unsubscribe;
  }, [navigation]);
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
  const Item = ({
    item,
    backgroundColor,
    textColor,
    borderColor,
    statusColor,
  }) => (
    <TouchableOpacity>
      <View style={[styles.item, backgroundColor, borderColor]} key={item._id}>
        <View style={[styles.subItem, backgroundColor, borderColor]}>
          <Text style={[styles.title, textColor]}>
            {item?.sellerId?.fullName}
          </Text>
          <Text style={[styles.title, textColor]}>
            Date:{new Date(item?.date).toDateString()}
          </Text>
          <Text style={[styles.title, textColor]}>
            {formatAMPM(
              new Date(item?.appointmentId?.timeslotObject?.startTime),
            )}
            -
            {formatAMPM(new Date(item?.appointmentId?.timeslotObject?.endTime))}
          </Text>
        </View>
        <View style={[styles.status, backgroundColor, borderColor]}>
          <Text style={[styles.statusText, statusColor]}>
            {item?.requestStatus === 100
              ? 'PENDING'
              : item?.requestStatus === 101
              ? 'ACCEPTED'
              : 'REJECTED'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  const renderItem = ({item}) => {
    console.log('----------------------', item);
    const backgroundColor = '#23293E';
    const color = 'white';
    const borderColor = '#23293E';
    const statusColor =
      item?.requestStatus === 100
        ? 'yellow'
        : item?.requestStatus === 101
        ? 'green'
        : 'red';
    return (
      <Item
        item={item}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
        borderColor={{borderColor}}
        statusColor={{color: statusColor}}
      />
    );
  };
  const getAppointmentList = async () => {
    setVisible(false);
    const appointmentListResponse = await Http.request(
      'get',
      '/user/appointment/getAppointmentsRequests',
    );
    if (appointmentListResponse && appointmentListResponse.success) {
      console.log(appointmentListResponse, 'appointmentListResponse');
      setAppointmentlist(appointmentListResponse.result);
    }
    setVisible(false);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Appointments</Text>
        <View style={styles.line} />
        <FlatList
          data={appointmentList}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      </SafeAreaView>
    </>
  );
};
AppointmentListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
const entireScreenHeight = Dimensions.get('window').height;
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({
  $rem: (entireScreenHeight * entireScreenWidth) / 19125,
});
const styles = EStyleSheet.create({
  container: {
    backgroundColor: '#0C101E',
    height: '100%',
    paddingLeft: '.188rem',
    paddingRight: '.188rem',
  },
  heading: {
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginLeft: '1.25rem',
    marginTop: '1rem',
  },
  // container: {
  //   flex: 1,
  //   marginTop: '1rem',
  //   marginBottom: '5.625rem',
  //   backgroundColor: '#0C101E',
  // },
  line: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginLeft: '1.25rem',
    marginRight: '1.25rem',
    marginTop: '0.313rem',
  },
  item: {
    padding: '1.25remrem',
    marginVertical: 8,
    marginHorizontal: '1rem',
    borderWidth: 2,
    borderRadius: '0.625rem',
    display: 'flex',
    flexDirection: 'row',
  },
  subItem: {
    // padding: '1.25remrem',
    // marginVertical: 8,
    // marginHorizontal: '1rem',
    // borderWidth: 2,
    // borderRadius: '0.625rem',
    display: 'flex',
    flexDirection: 'column',
  },
  status: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1rem',
  },
  statusText: {
    fontSize: '1.2rem',
    textAlign: 'right',
  },
  BinLogo: {
    width: '1.5rem',
    height: '1.5rem',
    tintColor: '#18A0FB',
    marginLeft: '2rem',
  },
  delete: {
    position: 'absolute',
    right: '1.625rem',
    alignSelf: 'center',
  },
  plusimg: {
    height: '3.688rem',
  },
  roundplus: {
    backgroundColor: '#18A0FB',
    width: '4.375rem',
    height: '4.375rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    // marginTop,
    position: 'absolute',
    right: '2.375rem',
    bottom: '0.625rem',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#212C31',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  button: {
    borderRadius: '0.625rem',
    // padding: 10,
    elevation: 2,
    width: '5.875rem',
    height: '2.5rem',
    justifyContent: 'center',
    marginRight: '0.625rem',
  },

  lottie: {
    width: 100,
    height: 100,
  },

  buttonNo: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  buttonClose: {
    backgroundColor: '#0981C6',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: '0.875rem',
  },
});

export default AppointmentListScreen;
