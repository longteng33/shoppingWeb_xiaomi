import Vue from 'vue'

// 定义全局的过滤器

// 对时间进行处理，参数为1970至今的毫秒数，转为文本'1970-01-01 08:08:47'
Vue.filter('dateFormat', function (originVal) {
    const dt = new Date(originVal);
    const year = dt.getFullYear();
    const month = (dt.getMonth() + 1 + '').padStart(2, '0');
    const date = (dt.getDate() + '').padStart(2, '0');
    const hour = (dt.getHours() + '').padStart(2, '0');
    const min = (dt.getMinutes() + '').padStart(2, '0');
    const sec = (dt.getSeconds() + '').padStart(2, '0');
    return `${year}-${month}-${date} ${hour}:${min}:${sec}`
  })

//   将时间值转为时间文本，如120000转为'00时02分00秒'
Vue.filter('timeFormat', function (timeVal) {
    let d = 1000 * 60 * 60 * 24;
    let h = 1000 * 60 * 60;
    let m = 1000 * 60;
    let s = 1000;
    timeVal=Number(timeVal);
    if(isNaN(timeVal)){
      return ''
    }
  
    let day = Math.floor(timeVal / d);
    timeVal = timeVal % d;
    let hour = Math.floor(timeVal / h).toString().padStart(2,'0');
    timeVal = timeVal % h;
    let min = Math.floor(timeVal / m).toString().padStart(2,'0');
    timeVal = timeVal % m;
    let sec = Math.floor(timeVal / s).toString().padStart(2,'0');
    timeVal = timeVal % s;
    let timeStr=hour + "时" + min+ "分" + sec + "秒";
    if (day == 0) {
      return timeStr
    } else {
      return day + "天" +timeStr;
    }
  })