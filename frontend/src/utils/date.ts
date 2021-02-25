import dayjs from "utils/dayjs";

/*
  Display UTC date that we got from server in the user current timezone format
 */
const displayDate = (date?: string): string => {
  return dayjs.utc(date).tz(dayjs.tz.guess()).format("YYYY-MM-DD HH:mm");
};

export default displayDate;
