# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "ubuntu/trusty64"

  # For remote debugging
  config.vm.network "forwarded_port", guest: 8081, host: 8081
  # For adb
  config.vm.network "forwarded_port", guest: 5037, host: 5037
  # For couchbase-sync-gateway
  config.vm.network "forwarded_port", guest: 4984, host: 4984

  # Use rsync to keep files on the host continually updated in the VM
  # This is required for live reload to work correctly
  config.vm.synced_folder ".", "/vagrant", type: "rsync", rsync__exclude: ".git/", rsync__args: ["--verbose", "--archive", "-z", "--copy-links"]

  config.vm.provider "virtualbox" do |vb|
    # Display the VirtualBox GUI when booting the machine
    # vb.gui = true
    # Customize the amount of memory on the VM:
    vb.memory = "2048"
    # Enable USB
    vb.customize ["modifyvm", :id, "--usb", "on"]
    vb.customize ['usbfilter', 'add', '0', '--target', :id, '--name', '1197123b', '--vendorid', '0x04e8']
    vb.customize ['usbfilter', 'add', '0', '--target', :id, '--name', 'android', '--vendorid', '0x18d1']    
  end

  config.vm.provision "shell", inline: <<-SHELL
    #### Install Android SDK - this section heavily borrowed from 
    #### https://github.com/driftyco/ionic-box/blob/master/bootstrap.sh
    ANDROID_SDK_FILENAME=android-sdk_r24.2-linux.tgz
    ANDROID_SDK=http://dl.google.com/android/$ANDROID_SDK_FILENAME

    apt-get update
    apt-get install -y npm git openjdk-7-jdk ant expect lib32stdc++6 lib32z1 xterm automake autoconf python-dev
    npm install -g n
    n stable

    wget --progress=bar:force $ANDROID_SDK
    tar -xzvf $ANDROID_SDK_FILENAME
    sudo chown -R vagrant android-sdk-linux/

    echo "export ANDROID_HOME=~/android-sdk-linux" >> /home/vagrant/.bashrc
    echo "export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64/" >> /home/vagrant/.bashrc
    echo "export PATH=\$PATH:~/android-sdk-linux/tools:~/android-sdk-linux/platform-tools" >> /home/vagrant/.bashrc

    expect -c '
        set timeout -1   ;
        spawn /home/vagrant/android-sdk-linux/tools/android update sdk -u --all --filter platform-tools,tools,build-tools-23,build-tools-23.0.1,build-tools-23.0.2,build-tools-23.1,build-tools-23.1.1,build-tools-23.1.2,build-tools-23,build-tools-23.0.1,android-22,android-23,addon-google_apis_x86-google-23,extra-android-support,extra-android-m2repository,extra-google-m2repository,extra-google-google_play_services,sys-img-armeabi-v7a-android-23
        expect { 
            "Do you accept the license" { exp_send "y\r" ; exp_continue }
            eof
        }
    '
    
    # Install Facebook's watchman
    git clone https://github.com/facebook/watchman.git
    cd watchman
    ./autogen.sh
    ./configure
    make
    sudo make install

    ### Install React Native w/ dependencies
    sudo npm install -g react-native-cli
    sudo npm install -g flow
    sudo npm install -g babel
    
    ### Below this point, run in the shared vagrant folder
    cd /vagrant

    ### Install packages
    sudo npm install
        
    ### Fix for https://github.com/xinthink/react-native-material-kit/issues/77
    cp node_modules/react-native-material-kit/android/build.gradle node_modules/react-native-material-kit/android/build.gradle.old
    sed "s/buildToolsVersion '23.0.2'/buildToolsVersion '23.0.1'/" node_modules/react-native-material-kit/android/build.gradle.old > node_modules/react-native-material-kit/android/build.gradle
        
    ## Prevent http://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc
    sudo npm dedupe
    sudo echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

    # Enable the gradle daemon - needs to be under /root since the react-native server runs as root
    sudo mkdir ~/.gradle
    sudo touch ~/.gradle/gradle.properties && sudo echo "org.gradle.daemon=true" >> ~/.gradle/gradle.properties
  SHELL
  
  # Note: below always runs when the "vagrant up" or "vagrant reload" is run
  config.vm.provision "shell", run: "always", inline: <<-SHELL
    export ANDROID_HOME=/home/vagrant/android-sdk-linux
    export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64/
    export PATH=\$PATH:/home/vagrant/android-sdk-linux/tools:/home/vagrant/android-sdk-linux/platform-tools

    cd /vagrant

    # Connect to IP if specified
    if [ -n $_ADB_EMULATOR_IP_ADDRESS ];
    then
        # Local version of ADB_EMULATOR_IP_ADDRESS with no whitespace
        export _ADB_EMULATOR_IP_ADDRESS=#{ENV['ADB_EMULATOR_IP_ADDRESS']}
        export _ADB_EMULATOR_IP_ADDRESS="$(echo -e $_ADB_EMULATOR_IP_ADDRESS | tr -d '[[:space:]]')"
        adb connect $_ADB_EMULATOR_IP_ADDRESS
        # Appears to need some time before the adb reverse command to correctly identify the device
        echo "Waiting for adb connection to stabilize"
        sleep 5
    fi

    # Open live-reload port
    adb reverse tcp:8081 tcp:8081

    # Start the react-native server and deploy to connected android device
    react-native run-android
    nohup sudo react-native start >/vagrant/react-native.log 2>&1 </dev/null &
    echo "Waiting for react-native server to start"
    sleep 5
    react-native run-android
  SHELL
  
end
