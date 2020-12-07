class Helper {

  static dateFormat(date) {
    if (date == null) {
      return "Invalid Date";
    } else {
      for (let i = 0; i < 2; i++) {
        date = date.replace("-", "");
      }
      date = date.substring(0, 8);
    }
    let getYear = date.substring(0, 4);
    let getMonth = this.monthFormat(date.substring(4, 6));
    let getDay = date.substring(6, 8);

    console.log(`${getDay} ${getMonth} ${getYear}`)

    return `${getDay} ${getMonth} ${getYear}`;
  }

  static inputDateFormat(date) {
    if (date == null) {
      return "Invalid Date";
    } else {
      for (let i = 0; i < 2; i++) {
        date = date.replace("-", "");
      }
      date = date.substring(0, 8);
    }
    let getYear = date.substring(0, 4);
    let getMonth = date.substring(4, 6);
    let getDay = date.substring(6, 8);

    console.log(`${getDay}-${getMonth}-${getYear}`)

    return `${getYear}-${getMonth}-${getDay}`;
  }

  static monthFormat(month) {
    switch (month) {
      case '01':
        return "Januari";
      case '02':
        return "Februari";
      case '03':
        return "Maret";
      case '04':
        return "April";
      case '05':
        return "Mei";
      case '06':
        return "Juni";
      case '07':
        return "Juli";
      case '08':
        return "Agustus";
      case '09':
        return "September";
      case '10':
        return "Oktober";
      case '11':
        return "November";
      case '12':
        return "Desember";

      default:
        break;
    }
  }

  static AmountFormat(value) {

    let strValue = String(value);
    let formatAmt = '';
    let countZero = 0;

    for (let i = strValue.length - 1; i >= 0; i--) {

      if (countZero === 3) {
        formatAmt += "," + strValue[i];
        countZero = 0;
      } else {
        formatAmt += strValue[i];
      }

      countZero++;
    }

    return formatAmt.split('').reverse().join('');

  }

}

export default Helper;