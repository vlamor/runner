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
deviceInfo.innerText = "Device #7th"
function SearchBT()
{
    deviceInfo.innerText +=" CLicked\n";
    navigator.bluetooth.requestDevice(options) //{filters:[{services:[ 'heart_rate' ]}]}
  .then((device) => 
  {
    console.log(device.name);
    deviceInfo.innerHTML += device.name;  
    return device.gatt.connect();
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });

}

