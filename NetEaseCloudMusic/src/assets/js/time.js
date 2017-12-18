/**
 * 获取毫秒数时间并格式化
 * @param t 毫秒数时间
 */
export function getFormatDate(t) {
    if (t == undefined) {
         return getFullDate();
    }
    let  time = new Date(),
         newTime = time.getTime(),//毫秒数
         second = 1000 * 1, // 秒
         minute =second * 60, //分钟
         hour = minute * 60, //小时
         day = hour * 24, // 天
         change = newTime - t;

    let  date = '';
         if (change < second) {
              date =  '刚刚';
         } else if (change < minute) {
              date =  Math.floor(change / second) + '秒前';
         } else if (change < hour) {
              date =  Math.floor(change / minute) + '分钟前';
         } else {
              date = getHourMinute(t);
         } 
         
    return date;
}

/**
 * 获取毫秒数时间并返回小时分钟
 * @param t 毫秒数时间
 */
export function getHourMinute(t) {
    let  newTime = new Date(),
         newDay = newTime.getDate(),
         newHour = newTime.getHours(),
         newMinute = newTime.getMinutes(),
         returnDate = '';

    newHour = newHour < 10 ? ('0' + newHour) : newHour ;
    newMinute = newMinute < 10 ? ('0' + newMinute) : newMinute ;

    if (t == undefined) {
         returnDate = newHour + ':' + newMinute;
    } else {
         let  time = new Date(t),
              day = time.getDate(),
              hour = time.getHours(),
              minute = time.getMinutes(),
              hourMinute = hour + ':' + minute;

         if (day == newDay) {
              returnDate = hourMinute;
         } else if (day == (newDay - 1)) {
              returnDate = '昨天 ' + hourMinute;
         } else {
              returnDate = getFullDate(t);
         }
    }

    return returnDate;
}

/**
 * 获取毫秒数时间并返回完整时间
 * @param t 
 */
export function getFullDate(t) {
    let  newTime = new Date(),
         newYear = newTime.getFullYear(),
         newMonth = newTime.getMonth() + 1,
         newDay = newTime.getDate(),
         newHour = newTime.getHours(),
         newMinute = newTime.getMinutes(),
         returnDate = '';

    newHour = newHour < 10 ? ('0' + newHour) : newHour ;
    newMinute = newMinute < 10 ? ('0' + newMinute) : newMinute ;

    if (t == undefined) {
         returnDate = newYear + '年' + newMonth + '月' + newDay + '日 ' + newHour + ':' + newMinute;
    } else {
         let  time = new Date(t),
              year = time.getFullYear(),
              month = time.getMonth() + 1,
              day = time.getDate(),
              hour = time.getHours(),
              minute = time.getMinutes();

         returnDate = newYear != year ? (year + '年') : '' ;
         hour = hour < 10 ? ('0' + hour) : hour ;
         minute = minute < 10 ? ('0' + minute) : minute ;
         returnDate += month + '月' + day + '日 ' + hour + ':' + minute;
    }
    return returnDate;
}

//把new Date()提出来