import { Pipe, PipeTransform } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: number): any {
    return new Observable<string>((observer: Observer<string>) => {
      observer.next(`Added ${this.timeAgo(value)}`);
      setInterval(() => observer.next(`Added ${this.timeAgo(value)}`), 60000)
    });
  }

  timeAgo(timestamp: number) {
    const base = { hour: 3600, minute: 60, day: 86400 };
    const timeNow = new Date().getTime()/1000;
    const margin = timeNow - (timestamp / 1000);

    let time = margin / base.hour;
    let result: any;

    if (time < 1) {
      let minutes = margin / base.minute;
      result = `${minutes} minutes ago`;
      if (minutes <= 0) {
        result = `a few seconds ago`;
      }
      if (minutes === 1) {
        result = `a minute ago`;
      }
      if (Number.isInteger(minutes) === false) {
        minutes = Math.round(minutes);
        result = `${minutes} minutes ago`;
        if (minutes === 1) {
          result = `a minute ago`;
        }
        if (minutes <= 0) {
          result = `a few seconds ago`;
        }
      }
    }

    if (time < 24 && time >= 1) {
      result = `${time} hours ago`;
      if (time === 1) {
        result = `an hour ago`;
      }
      if (Number.isInteger(time) === false) {
        time = Math.round(time);
        result = `${time} hours ago`;
      }
    }

    if (time >= 24) {
      const days = margin / base.day;
      if (days >= 1 && days < 2) {
        result = `yesterday`;
      }
      if (days >= 2 && days < 3) {
        result = `2 days ago`;
      }
      if (days >= 3 && days < 4) {
        result = `3 days ago`;
      }
      if (days >= 4 && days < 5) {
        result = `4 days ago`;
      }
      if (days >= 5 && days < 6) {
        result = `5 days ago`;
      }
      if (days >= 6 && days < 7) {
        result = `6 days ago`;
      }
      if (days >= 7) {
        result = `on ${this.convertDate(timestamp)}`;
      }
    }
    return result;
  }

  convertDate(timestamp: number) {
    const d = new Date(timestamp * 1000),
      // Convert the passed timestamp to milliseconds
      yyyy = d.getUTCFullYear(),
      mm = d.getUTCMonth() + 1,	// Months are zero based.
      dd = d.getUTCDate();
    let date: string, m = `${mm}`, ddd = `${dd}`;

      if (mm < 10) {
        m = `0${mm}`;
      }
      if (dd < 10) {
        ddd = `0${dd}`;
      }
    // ie: 21/02/2019
    date = `${ddd}/${m}/${yyyy}`;
    return date;
  }

}
