![Infinite Library](https://raw.githubusercontent.com/InfiniteLibrary/app/master/source/images/Title-Logo.png)

## Infinite Reader

A hybrid mobile application offline eBook reader. 

### Why?

We at Infinite Library share the desire to create an open and excellent reading experience on as many devices as possible and to collaborate on an open-source project using modern technology. Hopefully our project increases access to eBooks around the world.

### Android Quick Start With Vagrant
1. Connect an Android device with developer mode enabled OR install [Genymotion](https://www.genymotion.com/#!/download) and install a Nexus 5 or 7 (Android version 5.1). If using Genymotion, disable its ADB by selecting Settings -> ABD -> Use custom  Android SDK tools -> <blank>.
2. Install [Vagrant]{https://www.vagrantup.com/docs/getting-started/)
3. Install openssh and rsync using your operating system's package manager or installation tools - these are generally already installed on most Linux configurations.
If in Windows:
  1. Install [Cygwin](https://cygwin.com/install.html). Within the installer, choose the rsync and openssh packages as per https://github.com/mitchellh/vagrant/issues/3913#issuecomment-45761049. Also install git, under the "Devel" category, to allow cloning this repository.
  2. If Vagrant issue https://github.com/mitchellh/vagrant/issues/6702 is not yet resolved, you will need to follow the instructions under https://github.com/mitchellh/vagrant/issues/6702#issuecomment-166503021
  3. Launch a terminal using the "Cygwin terminal" shortcut on your desktop or Start Menu.
4. Clone this repository and change to the new folder.
5. If using a physical device run:
```
vagrant up
```
If using an emulator (replace IP address with your emulator's IP):
```
ADB_EMULATOR_IP_ADDRESS=192.168.56.101 vagrant up
```
This will start the virtual machine which is running the infinite-reader code copied from your host machine.
6. Start the Vagrant rsync daemon:
```
vagrant rsync-auto &
```
This will automatically sync changes from the host to the VM.
7. Optionally, connect to the virtual machine and monitor the output of the react server:
```
vagrant ssh
tail -f /vagrant/react-native.log
```
The infinite-reader should now be deployed to the phone or emulator. 
Enable live reload using the "shake" gesture (<kbd>Ctrl</kbd>-m in Genymotion) and select "Enable Live Reload".
Changes made to the code should automatically update on the device.

### Android Environment

Setting up an Android development environment takes a few steps. Once you get set up, you will see how easy it is to develop Android apps with Javascript. The app looks and feels, and is, in more ways that not, a true native app.

Get set up [here](https://facebook.github.io/react-native/docs/android-setup.html). 

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
5. `adb reverse tcp:8081 tcp:8081`      this connects the device debug port to your computers debug port
6. hit "Refresh JS"

**On Android**: You will probably get a "POST error" on a red screen. This is a known bug on the npm react-native-couchbase-lite module. The module should probably be part of the repo. For now, you must add the following to "/node_modules/react-native-couchbase-lite/index.js:148"

```
    if (data) {
      settings.body = JSON.stringify(data);
    }
    else {   // add this!
      //unresoved hack for error PUT must have a body and GET cant have body
      if (settings.method == "PUT") {
        settings.body = ".";
      }
    }
```

**On Linux**: To enable chrome debug you must change the mention of `google-chrome` to `chromium-browser` at "/node_modules/react-native/local-cli/server/middleware/getDevToolsMiddleware.js:19 and 23


### On iOS (the index.ios.js is not setup for gitburg and no components exist in the iOS directory)

1. Open `ios/ReactNativeCouchbaseLiteExample.xcodeproj` in Xcode.
2. Run `npm install` and `react-native start`.
3. Run the app on a simulator or device.

### Database

Here's the great part. The app is running a device database. When online, the database will sync with the server to get the latest in the catalog. The database is called couchbaseLite and there is an api to access the device db assets in the react-native-couchbase-lite npm module. Check it out. 

### Navigation

Becuase we don't need a lot of routes here, the current app uses the Navigation component. Perhaps the best way to see how this works is to follow what happens when you click a book to open it. In CatalogCell.js there is a `<TouchableElement>`. Awesome. When you select a book to read you touch this and `onPress={this.props.onSelect}` is triggered.

What are "props"? I like to think of them as "pops" because, when you say `this.props`, you are referencing the CatalogCell instance in whichever parent component it is used. So `this.props.onSelect` fires the onSelect method of the `<CatalogCell>` in Catalog.js. That in turn fires `this.selectBook(book)` which in turn fires 
```
this.props.navigator.push({
    title: book.title,
    name: 'reader',
    book: book,
}); 
```
Here's props again, so we are sending information up to the navigator and the key is we are passing the next route with `name:'reader'`. Name sets the route to go to next. Because all of the app essentially is wrapped in a Navigator component, the message arrives at the top-level component, which is the navigator, to set the route to "reader". The title and book are context variables for the next view. Understanding and tracing this path is the key to understanding not only how Navigator works but also how components work in React and React Native.


### Components

There are RN components and there are ones you create. The ones created are in "/app/android/components". Perhaps this diagram helps to explain the component structure as it (nearly) exists currently. RN components are in blue.

![diagram](https://cloud.githubusercontent.com/assets/3521359/12398008/e45cbe86-bdde-11e5-9c13-ad1560f8e701.jpg)
