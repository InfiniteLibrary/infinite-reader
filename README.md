![Infinite Library](https://raw.githubusercontent.com/InfiniteLibrary/app/master/source/images/Title-Logo.png)

## Infinite Reader

A hybrid mobile application offline eBook reader 

### Why?

We at Infinite Library share the desire to create an open and excellent reading experience on as many devices as possible and to collaborate on an open-source project using bleeding-edge technology. Hopefully our project increases access to eBooks around the world.

### Android Environment

Setting up an Android development environment takes a few steps, but once you get set up, you will see how easy it then is to develop Android apps with javascript. The app looks and feels, and is, in more ways that not, a true native app. Get set up [here](https://facebook.github.io/react-native/docs/android-setup.html). 

### Node Dependencies

1. `npm install -g react-native-cli`    // may need to run as root 
2. `npm install`

**Note**: all warnings are fine, errors are not. If you get an error, you may need to adjust one or two things. npm will usually suggest a good fix. Once you get past this you are about ready to code.

### Development Environment

If you have an Android device skip to 3.

1. Install an emulator. We suggest [Genymotion](https://www.genymotion.com/#!/download)
2. Run Genymotion and choose to install a Nexus 5 or 7 (Android version 5.1)
3. With the emulator running or device attached run 
    `react-native start`
  This will run the development enviroment. This is required so that if you make changes to you javascript and save, you can "reload js" on your device or emulator. On the device you can shake it to open the menu and on Genymotion you can click the menu on the lower right or use CMD-M
4. In a separate terminal run
    `react-native run-android`
  This will install the device to the device (or emulator). If you experience problems make sure that you have set up development mode on the device and that you have granted all development permissions in the settings.


### On iOS (codebase is not there yet but shouldn't be hard to implement)

1. Open `ios/ReactNativeCouchbaseLiteExample.xcodeproj` in Xcode.
2. Run `npm install` and `react-native start`.
3. Run the app on a simulator or device.

### Database

Here's the great part. The app is running a device database. When online, the database will sync with the server to get the latest in the catalog. The database is called couchbaseLite and there is an api to access the device db assets in the react-native-couchbase-lite npm module. Check it out. 

**Note**: For development purposes the app is configured to replicate currently from https://[   ]infinitelibrary.cloudant.com/gitburg/ to get the initial catalog. You must change that or ask us for the password to replicate from there. This means you'll have to add "infinitelibrary:password" to the [  ] part above, which is in the remoteURL variable in app/component/Home.js.

