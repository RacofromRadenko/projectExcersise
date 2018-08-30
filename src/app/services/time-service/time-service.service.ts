import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class TimeServiceService {
	constructor() {}

	getTimeInterval() {
		let interval = 14400;
		let currentTime = Math.floor(new Date().getTime() / 1000) + 7200;
		let res = [];
		let endTime = currentTime;
		let startTime;
		let period;
		for (let i = 0; i < 6; i++) {
			startTime = endTime - interval;
			period = [ startTime, endTime ];
			endTime -= interval;
			res.push(period);
		}
		return res;
	}
}
