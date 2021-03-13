import { Dayjs } from "dayjs";
import dayjs from "utils/dayjs";

/*
  Convert date that we got from server to the user current timezone
 */
const convertDateToUserTimezone = (date: string): Dayjs => {
  return dayjs.utc(date).tz(dayjs.tz.guess());
};

export const displayDatetime = (date?: string): string => {
  return convertDateToUserTimezone(date as string).format("YYYY-MM-DD HH:mm");
};

export const displayDate = (date?: string): string => {
  return convertDateToUserTimezone(date as string).format("YYYY-MM-DD");
};
