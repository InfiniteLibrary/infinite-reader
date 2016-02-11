# react-native-couchbase-lite

Couchbase Lite binding for react-native on both iOS and Android.

### Installation

```
$ npm install react-native-couchbase-lite --save
```

## iOS


* XCode CouchbaseLite project dependency set up: Drag the ReactCBLite Xcode project as a dependency project into your React Native Xcode project.

![](http://cl.ly/image/0S133n1O3g3W/static-library.png)

* XCode ReactCBLite library dependency set up: Add ReactCBLite.a (from Workspace location) to the required Libraries and Frameworks.

![](http://cl.ly/image/2c0Z2u0S0r1G/link.png)

* From the `Link Binary With Libraries` section in the `Build Phases` of the top-level project, add the following frameworks in your Xcode project (they are dependencies for Couchbase Lite)

	- libsqlite3.0.tbd
	- libz.tbd
	- Security.framework
	- CFNetwork.framework
	- SystemConfiguration.framework

* Download the Couchbase Lite iOS SDK from [here](http://www.couchbase.com/nosql-databases/downloads#) and drag CouchbaseLite.framework, CouchbaseLiteListener.framework, CBLRegisterJSViewCompiler.h and libCBLJSViewCompiler.a in the Xcode project.

![](http://cl.ly/image/3Z1b0n0W0i3w/sdk.png)

## iOS (Cocoapods)

* Create a new XCode project and run the following commands:

```
$ pod init
```

* Install both npm modules:

```
$ npm install react-native
$ npm install react-native-couchbase-lite
```

* In `Podfile`, add dependencies:

```
pod 'React', :path => './node_modules/react-native'
pod 'ReactNativeCouchbaseLite', :path => './node_modules/react-native-couchbase-lite'
```

* So far so good! Lastly, you must install CBLRegisterJSViewCompiler.h and libCBLJSViewCompiler.a that can be downloaded [here](http://www.couchbase.com/nosql-databases/downloads#) and located in the `Extras` folder. Open `{project-name}.xcworkspace` and drag both the header file and static lib in the project:

![](http://cl.ly/1L2s28462D2W/Image%202016-01-26%20at%2012.47.12%20pm.png)

## Android

* Add dependency to `android/settings.gradle`

```
...
include ':react-native-couchbase-lite'
project(':react-native-couchbase-lite').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-couchbase-lite/android')
```

* Add `android/build.gradle`

```
allprojects {
    repositories {
        mavenLocal()
        jcenter()

        // add couchbase url
        maven {
            url "http://files.couchbase.com/maven2/"
        }
    }
}
```

* Add `android/app/build.gradle`

```
apply plugin: 'com.android.application'

android {
    ...

    packagingOptions {
        exclude 'META-INF/ASL2.0'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/NOTICE'
    }
}

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.android.support:appcompat-v7:23.0.0'
    compile 'com.facebook.react:react-native:0.12.+'

    // Add this line:
    compile project(':react-native-couchbase-lite')
}
```

* Register module in `MainActivity.java`

  ```
  import me.fraserxu.rncouchbaselite.*;  // <--- import

  @Override
      protected void onCreate(Bundle savedInstanceState) {
          super.onCreate(savedInstanceState);
          mReactRootView = new ReactRootView(this);

          mReactInstanceManager = ReactInstanceManager.builder()
                  .setApplication(getApplication())
                  .setBundleAssetName("index.android.bundle")
                  .setJSMainModuleName("index.android")
                  .addPackage(new ReactCBLiteManager())  // <------- here
                  .addPackage(new MainReactPackage())
                  .setUseDeveloperSupport(BuildConfig.DEBUG)
                  .setInitialLifecycleState(LifecycleState.RESUMED)
                  .build();

          mReactRootView.startReactApplication(mReactInstanceManager, "MyApp", null);

          setContentView(mReactRootView);
      }
  ```

#### Usage

In your app entry, init and start the Couchbase Lite Listener

```JavaScript
import {manager, ReactCBLite} from 'react-native-couchbase-lite'
// init the Listener with a port and login credentials
ReactCBLite.init(5984, 'admin', 'password')

// instantiate a new database
var database = new manager('http://admin:password@localhost:5984/', 'myapp');
database.createDatabase()
  .then((res) => {
    database.getAllDocuments()
      .then((res) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(res.rows)
        });
      });
```

See the [example project](https://github.com/fraserxu/react-native-couchbase-lite/tree/master/ReactNativeCouchbaseLiteExample) for a more in-depth use case.



## Available commands

```
promise database.createDatabase();
promise database.createDesignDocument(string designDocumentName, object designDocumentViews);
promise database.createDocument(object json);
promise database.getDesignDocument(string designDocumentName);
promise database.queryView(string designDocumentName, string viewName);
promise database.deleteDocument(string documentId, string documentRevision);
promise database.getAllDocuments();
promise database.getDocument();
promise database.replicate(string source, string target, boolean continuous);
void    database.listen();
```

#### LICENSE
MIT
