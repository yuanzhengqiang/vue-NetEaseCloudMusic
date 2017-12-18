
export function setStorage(objName = '', param = {}, type = 'local', failureTime = 7) {
    if (objName == '' || param == {}) {
        return;
    }
    let storage = type == 'local' ? window.localStorage : window.sessionStorage;
    let date = new Date(),
        timestamp = date.getTime(), // 要保存的时间戳
        dayTime = 1000 * 60 * 60 *24 * failureTime,
        objStr = '',
        delIndex = -1,
        objArr = getStorage(objName, type, failureTime) || [];

        if (param.name) {
            for (let i = 0; i < objArr.length; i++) {
                if (objArr[i].name == param.name) {
                    delIndex = i;
                }
            }
            if (delIndex > -1) {
                objArr.splice(delIndex,1);
            }
            
        }
        
        param.timestamp = timestamp; // 时间戳
        param.failureTime = failureTime; // 失效时间- 天 
        objArr.unshift(param);
        objStr = JSON.stringify(objArr);
        storage.setItem(objName, objStr);
}

export function getStorage(objName = '', type = 'local', failureTime = 7) {
    if (objName == '') {
        return;
    }
    let storage = type == 'local' ? window.localStorage : window.sessionStorage;
    let newArr = [],
        date = new Date(),
        timestamp = date.getTime(), // 要保存的时间戳
        dayTime = 1000 * 60 * 60 *24,
        objStr = storage.getItem(objName) || '[]',
        objArr = JSON.parse(objStr);
        
        for (let i = 0; i < objArr.length; i++) {
            let dataTimestamp = objArr[i].timestamp,
                dataFailureTime = objArr[i].failureTime * dayTime,
                allDataTime = dataTimestamp + dataFailureTime;
            if (allDataTime > dayTime) {
                newArr.push(objArr[i]);
            }
        }
        
        return newArr;
} 

export function clearStorageItem(objName = '', timestamp = '', type = 'local') {
    if (objName == '' || timestamp == '') {
        return;
    }
    let storage = type == 'local' ? window.localStorage : window.sessionStorage;
    let objStr = storage.getItem(objName),
        objArr = JSON.parse(objStr),
        delIndex = -1;
        
    for (let i = 0; i < objArr.length; i++) {
        let dataTimestamp = objArr[i].timestamp;
        if (dataTimestamp == timestamp) {
            delIndex = i;
        }
    }
    if (delIndex > -1) {
        objArr.splice(delIndex,1);
    }
    
    objStr = JSON.stringify(objArr);
    storage.setItem(objName, objStr);
} 
  