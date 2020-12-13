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
var isSpeak = true;

parseValue = (value) => {
    // В Chrome 50+ используется DataView.
    value = value.buffer ? value : new DataView(value);
    let flags = value.getUint8(0);

    // Определяем формат
    let rate16Bits = flags & 0x1;
    let result = {};
    let index = 1;

    // Читаем в зависимости от типа
    if (rate16Bits) {
      result.heartRate = value.getUint16(index, /*littleEndian=*/true);
      index += 2;
    } else {
      result.heartRate = value.getUint8(index);
      index += 1;
    }

    // RR интервалы
    let rrIntervalPresent = flags & 0x10;
    if (rrIntervalPresent) {
      let rrIntervals = [];
      for (; index + 1 < value.byteLength; index += 2) {
        rrIntervals.push(value.getUint16(index, /*littleEndian=*/true));
      }
      result.rrIntervals = rrIntervals;
    }

    return result;
  }

var deviceInfo = document.getElementById('Device')
var rrInfo     = document.getElementById('rrValue')
deviceInfo.innerText = "Device #15th"
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
    var res = parseValue(value);
    var bpm = res.heartRate;
    var rrData  = res.rrIntervals;
    deviceInfo.innerHTML = bpm;
    rrInfo.innerHTML     = rrData;
    
    if(bpm > 90 && isSpeak)
    {
        isSpeak = false;
        console.log('High heart rate' + '  ' + isSpeak);
        speechSynthesis.speak(new SpeechSynthesisUtterance(bpm));
    }
    else
    {
        isSpeak = true;        
    }
    //console.log(parseValue(value));
  }

}

