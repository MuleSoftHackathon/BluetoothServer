BluetoothServer
===============
Bluetooth server enables the central server to control bluetooth devices

Installation
------------
1. Install nodeJS from [here](http://nodejs.org/)

2. Install git from [here](http://git-scm.com/downloads)


3. Clone the repository to your directory
  ```
  git clone https://github.com/MuleSoftHackathon/BluetoothServer.git
  ```


4. Go to BluetoothServer directory
  ```
  cd BluetoothServer
  ``` 


5. Install node modules
  ```
  npm install
  ```
  or
  ```
  sudo npm install
  ```


6. Run bluetooth server
  if connecting to central server
  ```
  cd app
  node app central_server_ip central_server_port your_key
  ``` 
  or running locally
  ```
  cd app
  node app
  ```
  then, you should see the message
  ```
  Connect to central server
  ```   
  or
  ```
  Running locally
  ```   

Remarks
-------
Bluetooth devices needs to be connected before starting the Bluetooth Server, otherwise you need to restart the server.

The serial port name needs to be set manually if different from the default. You can either do that by modifying the code in rccar.js and sphero.js respectively.

You can search the default name
  ```
  /dev/tty.HC-06-DevB
  ```
and change to 
  ```
  /dev/tty.YOUBLUETOOTHNAME-DevB
  ```
You can also do that by API calls
  ```
  GET
  /ports
  ```
  will list all the serial port on the machine
  ```
  POST
  /port
  
  ```
  with body
  ```
  {
  	"device" : "rccar",
  	"port" : "name of port",
  	"accessKey": "your accessKey or the key you specified when starting the server"
  }
  ```