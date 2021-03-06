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

var highHR = true;
var lowHR  = true;
var writeData = true;

var time;

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
deviceInfo.innerText = "Version #11th"
function SearchBT()
{
    writeData = true;
    navigator.bluetooth.requestDevice(options) //{filters:[{services:[ 'heart_rate' ]}]}
    .then((device) => 
    {
        console.log(device.name);
        deviceInfo.innerHTML += device.name;  
        return device.gatt.connect();
    })
    .then(server => 
    {
    return server.getPrimaryService('heart_rate');
    })
    .then(service => 
    {
        return service.getCharacteristic('heart_rate_measurement');
    })
    .then(characteristic => characteristic.startNotifications())
    .then(characteristic => {
        characteristic.addEventListener(
        'characteristicvaluechanged', handleCharacteristicValueChanged
    );
    })
    .catch(error => { console.log(error); });
}

function handleCharacteristicValueChanged(event) {
  var value = event.target.value;
  var res = parseValue(value);
  var bpm = res.heartRate;
  var rrData  = res.rrIntervals;
  if(writeData)
  {
    deviceInfo.innerHTML = bpm + " " + WriteBpm(bpm);
  }
  rrInfo.innerHTML     = rrData;
  
  if(bpm > 90 && highHR)
  {
      console.log(`High heart rate  ${highHR}`);
      highHR = false;
      lowHR  = true;
      speechSynthesis.speak(new SpeechSynthesisUtterance(bpm));
  }
  else if(bpm < 90 && lowHR )
  {
      speechSynthesis.speak(new SpeechSynthesisUtterance(bpm));
      highHR = true;       
      lowHR  = false; 
  }
  //console.log(parseValue(value));
}
//var data = [];
function WriteBpm(bpm)
{
  var today  = new Date();
  //var currentDate = new Date();
  time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var plainObject = {
    currentTime: time,
    bitpermin: bpm
  };
  if(writeData)
  {
    sessionStorage.setItem(
      time,
      JSON.stringify(plainObject)
    );
  }

  return time;
}

function Stop()
{
  var keys = Object.keys(sessionStorage);
  var i = 0;
  var key;
  console.log("---------------------------------");
  console.log(keys.length);
  for (; (key = keys[i]); i++) {
    var fromSSJSON = sessionStorage.getItem(key);
    //myField.innerHTML = JSON.parse(fromSS).myStaticField;
    var fromSS = JSON.parse(fromSSJSON);
    console.log(key + " - " + fromSSJSON);
    //console.log("2 - " + fromSS.minute);
    //console.log("3 - " + fromSS.second);
  }
  /* console.log(sessionStorage.length);
  for (var i = 0; i < sessionStorage.length; i++)
  {
    //document.body.append(sessionStorage.getItem(sessionStorage.key(i)));
    console.log(`${sessionStorage.getItem(sessionStorage.key(i))}`);
  }*/
  writeData = false;
  sessionStorage.clear(); 
}

