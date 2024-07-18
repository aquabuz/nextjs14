const dateFormat = {
  /**
   * @param value
   * @param format
   * @returns
   * @description UTC 시간대 주의
   */
  parser: (value: string, format: string) => {
    let date = null;
    if (value.toString().length === 10) {
      date = new Date(Number(value) * 1000);
    } else {
      date = new Date(value);
    }
    const pattern = new RegExp(/[0-9a-z]+/, "gi");
    const scAr = Array.from(new Set(format.replace(pattern, "")));

    // year
    const yearCnt = dateFormat.getMatchCnt(format, "y");
    let year = "";
    if (yearCnt.length == 2) {
      year = (date.getUTCFullYear() % 100) + "";
    } else if (yearCnt.length == 4) {
      year = date.getUTCFullYear() + "";
    }
    // month
    const monthCnt = dateFormat.getMatchCnt(format, "M");
    let month = "";
    if (monthCnt.length > 0) {
      month = date.getUTCMonth() + 1 + "";
      month = month.padStart(monthCnt.length, "0");
    }
    // day
    const dayCnt = dateFormat.getMatchCnt(format, "d");
    let day = "";
    if (dayCnt.length > 0) {
      // day = date.getDate() + ""; 유의> 로컬 시간 (한국 +9) 로 계산됨
      day = date.getUTCDate() + "";
      day = day.padStart(dayCnt.length, "0");
    }
    // hour 0-23
    let hourCnt = dateFormat.getMatchCnt(format, "H");
    let hour = "";
    if (hourCnt.length > 0) {
      if (value.indexOf("T") != -1) {
        hour = date.getUTCHours() + "";
      } else {
        hour = date.getUTCHours() + "";
      }
      hour = hour.padStart(hourCnt.length, "0");
    } else {
      // 1-12
      hourCnt = dateFormat.getMatchCnt(format, "h");
      if (hourCnt.length > 0) {
        hour = (date.getUTCHours() % 12) + "";
        hour = hour.padStart(hourCnt.length, "0");
      }
    }
    // minute
    const minuteCnt = dateFormat.getMatchCnt(format, "m");
    let minute = "";
    if (minuteCnt.length > 0) {
      minute = date.getUTCMinutes() + "";
      minute = minute.padStart(minuteCnt.length, "0");
    }

    // sec
    const secCnt = dateFormat.getMatchCnt(format, "s");
    let sec = "";
    if (secCnt.length > 0) {
      sec = date.getUTCSeconds() + "";
      sec = sec.padStart(secCnt.length, "0");
    }

    if (year != "" && month != "" && day != "") {
      // 년월일 시분초가 다 있음.
      if (hour != "" && minute != "" && sec != "") {
        if (scAr.length == 0) {
          return year + month + day + hour + minute + sec;
        } else if (scAr.length == 3) {
          return (
            year +
            scAr[0] +
            month +
            scAr[0] +
            day +
            scAr[1] +
            hour +
            scAr[2] +
            minute +
            scAr[2] +
            sec
          );
        } else if (scAr.length == 7) {
          return (
            year +
            scAr[0] +
            month +
            scAr[1] +
            day +
            scAr[2] +
            scAr[3] +
            hour +
            scAr[4] +
            minute +
            scAr[5] +
            sec +
            scAr[6]
          );
        }
      }
      // 년월일만 있음
      if (scAr.length == 0) {
        return year + month + day;
      } else if (scAr.length == 1) {
        return year + scAr[0] + month + scAr[0] + day;
      }
    } else {
      // 시분초만 있음
      if (scAr.length == 0) {
        return hour + minute + sec;
      } else if (scAr.length == 1) {
        return hour + scAr[0] + minute + scAr[0] + sec;
      }
    }
    return value;
  },
  getMatchCnt: (format: string, ch: string) => {
    if (format.indexOf(ch) === -1) {
      return [];
    }
    const temp = new RegExp(`${ch}`, "g");
    const match = format.match(temp);
    if (null != match) {
      return match.filter((i) => i !== "");
    }
    return [];
  },
};

export default dateFormat;
