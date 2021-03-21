import { Dayjs } from "dayjs";
import dayjs from "utils/dayjs";

export const DATE_INPUT_FORMAT = "YYYY-MM-DD";
const DISPLAY_DATE_FORMAT = DATE_INPUT_FORMAT;

/*
  Convert date that we got from server to the user current timezone
 */
const convertDateToUserTimezone = (date: string): Dayjs => {
  return dayjs.utc(date).tz(dayjs.tz.guess());
};

export const displayDatetime = (date?: string): string => {
  return convertDateToUserTimezone(date as string).format(`${DISPLAY_DATE_FORMAT} HH:mm`);
};

export const displayDate = (date?: string): string => {
  return convertDateToUserTimezone(date as string).format(DISPLAY_DATE_FORMAT);
};
