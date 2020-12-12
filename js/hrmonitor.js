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
navigator.bluetooth.requestDevice({filters:[{services:[ 'heart_rate' ]}]}) //options
  .then(device => {
    log('> Name:             ' + device.name);
    log('> Id:               ' + device.id);
    log('> Connected:        ' + device.gatt.connected);
  })
  .catch(error => {
    log('Argh! ' + error);
  });