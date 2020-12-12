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
deviceInfo.innerText = "Device"
navigator.bluetooth.requestDevice({filters:[{services:[ 'heart_rate' ]}]}) //options
  .then(device => {
    log('> Name:             ' + device.name);
    deviceInfo.innerText += device.name;
    log('> Id:               ' + device.id);
    log('> Connected:        ' + device.gatt.connected);
  })
  .catch(error => {
    log('Argh! ' + error);
  });

