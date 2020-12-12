console.log("hrmonitor.js")

var options = 
{
    filters:
    [
        {
            services:[ 'heart_rate' ]
        }
    ]
}
var deviceInfo = document.getElementById('Device')
deviceInfo.innerText = "Device #8th"
function SearchBT()
{
    //deviceInfo.innerText +=" CLicked\n";
    navigator.bluetooth.requestDevice(options) //{filters:[{services:[ 'heart_rate' ]}]}
  .then((device) => 
  {
    console.log(device.name);
    deviceInfo.innerHTML += device.name;  
    return device.gatt.connect();
  })
  .then(server => {
    return server.getPrimaryService('heart_rate');
  })
  .then(service => {
    return service.getCharacteristic('heart_rate_measurement');
  })
  .then(characteristic => characteristic.startNotifications())
  .then(characteristic => {
    characteristic.addEventListener(
      'characteristicvaluechanged', handleCharacteristicValueChanged
    );
  })
  .catch(error => { console.log(error); });

  function handleCharacteristicValueChanged(event) {
    var value = event.target.value;
    deviceInfo.innerHTML = parseValue(value);
  }

}

