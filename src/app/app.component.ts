import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FetchDataService } from './services/FetchFromBe/fetch-data.service';
import { TimeServiceService } from './services/time-service/time-service.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
	subscription: Subscription;

	tableFlag: boolean = false;
	flag: boolean = false;
	percentage = ' %';
	realTime: number;
	someArray = [];
	helpArray = [];
	getOppsData = [];
	object: any;
	fourFlag: boolean = true;
	opportunitiesArray = [];
	mainFlag: boolean = false;
	twentyFourFlag: boolean = false;
	bestTenInPast4Hours = [];
	bestTwelveByProfitInPast24Hours = [];

	constructor(public fetchFromBE: FetchDataService, public time: TimeServiceService) {
		this.fetchDataFromBackend();
		// this.fetchFromBE.dataBE.subscribe((result) => {
		// 	if (typeof result.arb_opportunities !== 'undefined') {
		// 		this.getOppsData = result.arb_opportunities;
		// 		this.profitOfAnArray(this.getOppsData);
		// 	} else {
		// 		this.object = result.arb_opportunities;
		// 		this.profitOfAnObject(this.object);
		// 	}
		// });
	}

	fetchDataFromBackend() {
		this.fetchFromBE.dataBE.subscribe((response) => {
			if (response.arb_opportunities.length !== undefined) {
				this.mainFlag = true;
				this.helpArray = this.massiveHumanTimestamp(response.arb_opportunities);
				this.opportunitiesArray = this.massiveHumanTimestamp(response.arb_opportunities);
				this.profitForArrayOpps(this.opportunitiesArray);
			} else {
				this.object = response.arb_opportunities;
				this.opportunitiesArray.unshift(this.humanTimeStamp(response.arb_opportunities));
				this.profitForObjectOpps(this.object);
				this.opportunitiesArray.pop();
			}
			// this.opportunitiesArray = response.arb_opportunities;
			// console.log('1', this.opportunitiesArray);
			// if (typeof response.arb_opportunities !== 'undefined') {
			// 	this.object = response.arb_opportunities;
			// 	console.log('object', this.object);
			// }
		});
	}

	massiveHumanTimestamp(inputArray) {
		let res = [];
		let newElement;
		inputArray.forEach((element) => {
			newElement = element;
			newElement.hTimeStamp =
				new Date(element.Timestamp * 1000).toLocaleDateString() +
				' ' +
				new Date(element.Timestamp * 1000).toLocaleTimeString();
			res.push(newElement);
		});

		return res;
	}

	humanTimeStamp(inputElement) {
		let res;
		res = inputElement;
		res.hTimeStamp = inputElement.hTimeStamp =
			new Date(inputElement.Timestamp * 1000).toLocaleDateString() +
			' ' +
			new Date(inputElement.Timestamp * 1000).toLocaleTimeString();
		return res;
	}

	realTimeOpps() {
		this.receiveData(this.helpArray);
		this.oneByOne(this.object);
		this.tableFlag = true;
	}

	oneByOne(result) {
		this.someArray.unshift(result);
		this.flag = true;
		this.fourFlag = false;
		this.twentyFourFlag = false;
	}

	receiveData(result) {
		let arraySort;
		this.someArray.push(result);
		arraySort = this.opportunitiesArray.sort(function(a, b) {
			return b.Timestamp - a.Timestamp;
		});
		this.flag = true;
		this.fourFlag = false;
		this.twentyFourFlag = false;
	}

	getTopOPps(startTime, endTime, topPlaces, inputArray) {
		let result = [];

		for (let i = 0; i < inputArray.length; i++) {
			if (inputArray[i].Timestamp < endTime) {
				if (inputArray[i].Timestamp > startTime) {
					result.push(inputArray[i]);
				}
			}
		}

		result.sort((a, b) => {
			return b.Profit - a.Profit;
		});
		result = result.slice(0, topPlaces);

		return result;
	}

	profitForArrayOpps(inputArray) {
		let result = [];
		let inputElement;

		inputArray.forEach((element) => {
			inputElement = element;
			inputElement.Profit = element.Profit = (element.Profit * 100).toString().substring(0, 4);
			result.push(inputElement);
		});
		return result;
	}

	profitForObjectOpps(inputObject) {
		let inputElement;
		inputElement = inputObject;
		inputElement.Profit = (inputObject.Profit * 100).toString().substring(0, 4);
		return inputElement;
	}

	public makeForBestTen() {
		let helperOppsArray = this.opportunitiesArray.slice(0);
		let timeRange = this.time.getTimeInterval();
		this.bestTenInPast4Hours = this.getTopOPps(timeRange[0][0], timeRange[0][1], 10, helperOppsArray);
		this.flag = false;
		this.tableFlag = true;
		this.fourFlag = true;
		this.twentyFourFlag = false;
	}

	public makeForBestTwenyFour() {
		let helperOppsArray = this.opportunitiesArray.slice(0);
		let timeRange = this.time.getTimeInterval();
		let tmpOpps = [];
		let element = null;
		for (let i = 0; i < 6; i++) {
			element = this.getTopOPps(timeRange[i][0], timeRange[i][1], 2, helperOppsArray);
			tmpOpps = tmpOpps.concat(element);
		}
		this.bestTwelveByProfitInPast24Hours = tmpOpps;
		this.twentyFourFlag = true;
		this.tableFlag = true;
		this.fourFlag = false;
		this.flag = false;
	}

	ngOnDestroy() {
		// Only need to unsubscribe if its a multi event Observable
		this.subscription.unsubscribe();
	}
}
