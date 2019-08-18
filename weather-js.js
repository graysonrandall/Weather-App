// Load and display data
	function hdnWeatherJsonpCallback(data) {
		let currentDiv = document.getElementById('current');
		let forecastDiv = document.getElementById('forecast');
		let weeklyList = document.querySelector('ul');
		let selectCity = document.getElementById('selectCity');
		let body = document.querySelector('body');
		let city = 9;
		//initially populate the page
		window.onload = () => {
			populateSelect();
			displayCurrent();
			weeklyForecast();
		}
		//Update data based on city change
		selectCity.onchange = () => {
			city = selectCity.value;
			removeListItems();
			displayCurrent();
			weeklyForecast();
		}
		//Reset data every 10 minutes
		setInterval(function() {
			console.log('Reset');
			removeListItems();
			displayCurrent();
			weeklyForecast();
		}, 600000);

		//Icon Data
		let weathericons = '{"weather" : [' +
									'{"id":"sunny"},' +
									'{"id":"mostlysunny"},' +
									'{"id":"clear"},' +
									'{"id":"partlysunny"},' +
									'{"id":"cloudy"},' +
									'{"id":"rainy"},' +
									'{"id":"partlycloudy"}' +
							 ']}';
		let obj = JSON.parse(weathericons);

		//remove previous data before populating new list items
		function removeListItems() {
			let allListItems = document.querySelectorAll('li');
			for (var i = 0; i < allListItems.length; i++) {
		    weeklyList.removeChild(allListItems[i]);
		  }
		}
		//Populate the select element with all cities
		function populateSelect() {
			for (let i = 0; i < data.cities.length; i++) {
				let option = document.createElement('option');
				let optValue = i;
				let optCity = data.cities[i].geoloc.city;
				if (optValue == 9) {
					option.setAttribute('selected', 'selected');
				}
				option.innerHTML = optCity;
				option.value = optValue;
				selectCity.appendChild(option);
			}
		}
		//Display current temp and condition and set night mode or cloudy mode
		function displayCurrent() {

			//darkmode
			let nyTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
			nyTime = new Date(nyTime);
			let hours = nyTime.getHours();
			if (hours >= 20 || hours <= 7 && data.cities[city].current[0].condition !== 'Cloudy') {
				body.classList.add('darkmode');
			} else if (hours <= 20 && hours >= 7 && data.cities[city].current[0].condition == 'Cloudy') {
				body.classList.add('cloudy');
			} else if (hours <= 20 && hours >= 7 && data.cities[city].current[0].condition !== 'Cloudy') {
				body.classList.add('day');
			}

			let temp = '<p>' + 'It is ' + '<strong>' + data.cities[city].current[0].temp + '&deg;' + '</strong>' + ' outside now' + '</p>';
			let condition = '<p>' + 'The condition is: ' + '<strong>' + data.cities[city].current[0].condition + '</strong>' + '</p>';

			if (data.cities[city].current[0].condition == 'Sunny') {
				currentDiv.innerHTML =  temp + condition;
				currentDiv.classList.add('sunny');
			} else if (data.cities[city].current[0].condition == 'Cloudy') {
				currentDiv.innerHTML =  temp + condition;
				currentDiv.classList.add('cloudy-h');
			} else if (data.cities[city].current[0].condition == 'Rainy') {
				currentDiv.innerHTML =  temp + condition;
				currentDiv.classList.add('rainy');
			} else if (data.cities[city].current[0].condition == 'Partly Sunny') {
				currentDiv.innerHTML =  temp + condition;
				currentDiv.classList.add('partly-sunny');
			} else if (data.cities[city].current[0].condition == 'Partly Cloudy') {
				currentDiv.innerHTML =  temp + condition;
				currentDiv.classList.add('partly-cloudy');
			} else {
				currentDiv.innerHTML =  temp + condition;
			}
		}

		//Populate list with weekly forecast and icons
		function weeklyForecast() {
			for (let i = 0; i < (data.cities[city].weekly.length); i++) {
				if (i >= 2 && i <= 8) {
					let li = document.createElement('li');
					let text, img;
					let day = data.cities[city].weekly[i].weekday;
					let d = new Date();
				  let current = d.getDay()
					current = (current + 2);
					let high = data.cities[city].weekly[i].high;
					let low = data.cities[city].weekly[i].low;
					let condition = data.cities[city].weekly[i].daycondition;
					let awicon = data.cities[city].weekly[i].awdayicon;

					for (var j=0; j<=obj.weather.length; j++) {
						let x = 6;
						let urlSetup = obj.weather[j].id;
						if (awicon == urlSetup && j <= x) {
							img = '<img src=\"svg/' + urlSetup + '.svg\" alt=\"' + awicon + '\" />';
							break;
						} else if (j >= x) {
							console.log('Else ' + awicon);
							img = '<img src=\"svg/cloudy.svg\" alt=\"' + awicon + '\" />';
							break;
						}
					}

					if (current == i) {
						text = img + '<p><strong><i>Today</i> / ' + day + ' &middot</strong>' + ' High of ' + high + ' / Low of ' +  low + '<span>' + condition + '</span>' + '</p>';
						li.classList.add("current-day");
						li.innerHTML = text;
						weeklyList.appendChild(li);
					} else {
						text = img + '<p><strong>' + day + ' &middot</strong>' + ' High of ' + high + ' / Low of ' +  low + '<span>' + condition + '</span>' + '</p>';
						li.innerHTML = text;
						weeklyList.appendChild(li);
					}
				}
			}
		}
	}
