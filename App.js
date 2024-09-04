import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  ToastAndroid,
  MediaScannerConnection,
  Platform,
  Alert,
} from 'react-native';
import Signature from 'react-native-signature-canvas';
import RNFetchBlob from 'react-native-fetch-blob';

const SignatureScreen = () => {
  const [signature, setSignature] = useState(null);
  const ref = useRef();

  const handleOK = signature => {
    // console.log(signature);
    setSignature(signature);
  };

  const handleSave = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) {
        // return true;
      }

      // console.log(hasPermission);
      downloadImage();
    } catch (err) {
      console.warn(err);
    }
  };

  const downloadImage = () => {
    const dirs = RNFetchBlob.fs.dirs;
    var image_data = signature.split('data:image/png;base64,');
    const filePath =
      dirs.DownloadDir +
      '/' +
      'signture' +
      new Date().getMilliseconds() +
      '.png';
    RNFetchBlob.fs.writeFile(filePath, image_data[1], 'base64').then(() => {
      console.log('Successfuly saved to' + filePath);
      Alert.alert('File saved successfully');
    });
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  const style = `.m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
    }`;
  return (
    <View style={{flex: 1}}>
      <Signature
        onOK={handleOK}
        ref={ref}
        onEmpty={handleEmpty}
        descriptionText="Sign"
        clearText="Clear"
        confirmText="Save"
        webStyle={style}
      />
      <View style={styles.preview}>
        {signature ? (
          <Image
            resizeMode={'contain'}
            style={{width: 335, height: 114}}
            source={{uri: signature}}
          />
        ) : null}
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleSave}>
        <Text style={styles.btnText}>Save to Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignatureScreen;
const styles = StyleSheet.create({
  preview: {
    width: '90%',
    height: 200,
    // backgroundColor: 'yellow',
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  btn: {
    width: '80%',
    height: 54,
    backgroundColor: 'orange',
    borderRadius: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 45,
  },

  btnText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
});
