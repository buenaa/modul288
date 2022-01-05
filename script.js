
//For Schlaufe für Stunden
for(let i = 0; i < 24; i++) {
	let select = document.getElementById("hours");
	let option = "<option value='" + i + "'>" + pad(i, 2) + "</option>";
	
	select.insertAdjacentHTML( 'beforeend', option );
}

//For Schlaufe für Minuten
for(let i = 0; i < 60; i++) {
	let select = document.getElementById("minutes");
	let option = "<option value='" + i + "'>" + pad(i, 2) + "</option>";

	select.insertAdjacentHTML( 'beforeend', option );
}

function search() {
	//Empty div
	document.getElementById("result").innerHTML = "";
	
	//Get all input values with object literal notation
	let formData = {
		from: document.getElementById("from").value,
		to: document.getElementById("to").value,
		date: document.getElementById("date").value,
		hours: document.getElementById("hours").value,
		minutes: document.getElementById("minutes").value,
	}

	
	if (formData.from === "" || formData.to === "" || formData.date === "" || formData.hours === "" || formData.minutes === "") {
		alert("Fehlende Angaben");
	}else {
		//Create url
		let url = "http://transport.opendata.ch/v1/connections?from=" + formData.from + "&to=" + formData.to + "&date=" + formData.date + "&time=" + formData.hours + ":" + formData.minutes;
		
		//Get Request from API
		let result = httpGet(url);
		
		//Convert json string to js object
		let obj = JSON.parse(result);
		
		
		//Read js object and show it
		obj.connections.forEach(function (value) {
			let fromDeparture = new Date(Date.parse(value.from.departure));
			let fromDepartureFormated = fromDeparture.getDate() + "." + (fromDeparture.getMonth() + 1) + "." + fromDeparture.getFullYear() + ", " + pad(fromDeparture.getHours(), 2) + ":" + pad(fromDeparture.getMinutes(), 2);
			let fromPlatform = value.from.platform;
			let fromLocationName = value.from.location.name;
			let duration = value.duration;
			let toArrival = new Date(Date.parse(value.to.arrival));
			let toArrivalFormated = toArrival.getDate() + "." + (toArrival.getMonth() + 1) + "." + toArrival.getFullYear() + ", " + pad(toArrival.getHours(), 2) + ":" + pad(toArrival.getMinutes(), 2);
			let toPlatform = value.to.platform;
			let toLocationName = value.to.location.name;
			let transfers = value.transfers;
			let products = "";
			
			value.products.forEach(function(p) {
				if (products === "") {
					products = p;
				} else {
					products = products + ", " + p;
				}
			})
			
			// console.log("------------------------");
			// console.log("From Departure: " + fromDepartureFormated);
			// console.log("From Platform: " + fromPlatform);
			// console.log("From Location Name: " + fromLocationName);
			// console.log("Duartion: " + duration);
			// console.log("To Arrival: " + toArrivalFormated);
			// console.log("To Platform: " + toPlatform);
			// console.log("To Location Name: " + toLocationName);
			// console.log("Transfers: " + transfers);
			// console.log("Products: " + products);
			
			let result =
				"<div class='row mt-5 p-3 well'>" +
				"<div class='col-3'>" +
				"<h3>Departure</h3><br>" +
				"<strong class='name'>" + fromLocationName + "</strong><br>" +
				fromDepartureFormated + " " + "<i class='far fa-clock'></i><br>" +
				"</div>" +
				"<div class='col-6 text-middle'>" +
				"<img src='train.png' alt='train' class=' train'>" + products +
				"</div>" +
				"<div class='col-3 text-right'>" +
				"<h3>Arrival</h3><br>" +
				"<strong class='name'>" + toLocationName + "</strong><br>" +
				toArrivalFormated + " " + "<i class='far fa-clock'></i><br>" +
				"</div>" +
				"<div class='col-12 text-middle'><br>" +
				duration + "<br>" +
				"Transfers: " + "<strong>" + transfers + "</strong>" +
				"</div>" +
				"<div class='col-6'>" +
				"Platform: " + "<strong>" + fromPlatform + "</strong>" +
				"</div>" +
				"<div class='col-6 text-right'>" +
				"Platform: " + "<strong>" + toPlatform + "</strong>" +
				"</div></div></div>";
			
			let resultElement = document.getElementById("result");
			resultElement.insertAdjacentHTML('beforeend', result);
		})
	}
}

//Function for getting json from parameter url
function httpGet(theUrl) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	xmlHttp.send( null );
	return xmlHttp.responseText;
}

//Function to get the time to double digits
function pad(num, size) {
	num = num.toString();
	while (num.length < size) {
		num = "0" + num;
	}
	
	return num;
}