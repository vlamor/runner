var options = 
{
    filters:
    [
        {
            services:[ 'heart_rate' ]
        }
    ]
}
navigator.bluetooth.requestDevice(options)
  .then(device => {
    log('> Name:             ' + device.name);
    log('> Id:               ' + device.id);
    log('> Connected:        ' + device.gatt.connected);
  })
  .catch(error => {
    log('Argh! ' + error);
  });