import React, {useState, useEffect} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Http} from '../../services';

const SellerListScreen = ({navigation}) => {
  const [sellersList, setSellerslist] = React.useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getSellerlist();
    });
    return unsubscribe;
  }, [navigation]);
  const Item = ({item, onPress, backgroundColor, textColor, borderColor}) => (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.item, backgroundColor, borderColor]} key={item._id}>
        <Text style={[styles.title, textColor]}>{item.fullName}</Text>
      </View>
    </TouchableOpacity>
  );
  const renderItem = ({item}) => {
    console.log('----------------------', item);
    const backgroundColor = item._id === selectedId ? '#23293E' : '#23293E';
    const color = item._id === selectedId ? 'white' : 'white';
    const borderColor = item._id === selectedId ? '#18A0FB' : '#23293E';

    const selectSeller = item => {
      setSelectedId(item._id);
      console.log(item, 'item');
      navigation.navigate('BookingScreen', {
        sellerData: item,
      });
    };

    return (
      <Item
        item={item}
        onPress={() => selectSeller(item)}
        backgroundColor={{backgroundColor}}
        textColor={{color}}
        borderColor={{borderColor}}
      />
    );
  };
  const getSellerlist = async () => {
    const sellerListResponse = await Http.request(
      'get',
      '/user/appointment/getSellers',
    );
    if (sellerListResponse && sellerListResponse.success) {
      console.log(sellerListResponse, 'sellerListResponse');
      setSellerslist(sellerListResponse.result);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Sellers</Text>
        <View style={styles.line} />
        <FlatList
          data={sellersList}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          extraData={selectedId}
        />
      </SafeAreaView>
    </>
  );
};
SellerListScreen.propTypes = {
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
  title: {
    fontSize: '1rem',
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

export default SellerListScreen;
