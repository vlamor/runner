console.log("hrmonitor.js")

/*var options = 
{
    filters:
    [
        {
            services:[ 'heart_rate' ]
        }
    ]
}*/
var deviceInfo = document.getElementById('Device')
deviceInfo.innerText = "Device #5th"
function SearchBT()
{
    deviceInfo.innerText +=" CLicked";
navigator.bluetooth.requestDevice({filters:[{services:[ 'heart_rate' ]}]}) //options
  .then(device => {
    console.log('> Name:             ' + device.name);
    deviceInfo.innerText += device.name;
    console.log('> Id:               ' + device.id);
    console.log('> Connected:        ' + device.gatt.connected);
  })//.then(function(device){return device.gatt.connect})
  .catch(error => {
    console.log('Argh! ' + error);
  });

}

