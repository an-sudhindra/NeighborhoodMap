import React, {Component} from 'react';
import { GOOGLE_MAP_API_KEY } from "../data/keys";
import { FOURSQUARE_CLIENT_ID } from "../data/keys";
import { FOURSQUARE_CLIENT_SECRET } from "../data/keys";
import { data } from "../data/data";
import { mapStyle } from "../data/mapStyle";
import markerPng from "../images/marker.png";
import currentMarkerPng from "../images/current_marker.png";
import ListPane from './ListPane';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allLocations:data,
			map: '',
			infoWindow: '',
			prevMarker: ''
		};

		this.initMap = this.initMap.bind(this);
		this.openInfoWindow = this.openInfoWindow.bind(this);
		this.closeInfoWindow = this.closeInfoWindow.bind(this);
	}

	componentDidMount() {
		// Connect the initMap() function within this class to the global window context, so Google Maps can invoke it. Then load google map.
		window.initMap = this.initMap;
		loadGoogleMap();
	}

	/* Initialising Google map */
	initMap() {
		let _this = this;

		let mapDiv = document.getElementById('map');
		let InfoWindow = new window.google.maps.InfoWindow({});

		mapDiv.style.height = "100vh";
		let map = new window.google.maps.Map(mapDiv, {
			center: { lat: 12.8399, lng: 77.6770 },
			zoom: 14,
			styles: mapStyle,
			mapTypeControl: false
		});

		window.google.maps.event.addListener(map, 'click', function () {
			_this.closeInfoWindow();
		});
		
		window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
			_this.closeInfoWindow();
		});

		this.setState({
			map: map,
			infoWindow: InfoWindow
		});

		// function to resize the map on resizing window 
		window.google.maps.event.addDomListener(window, "resize", function () {
			let center = map.getCenter();
			window.google.maps.event.trigger(map, "resize");
			_this.state.map.setCenter(center);
		});

		let allLocations = [];
		this.state.allLocations.forEach((loc)=> {
			let marker = new window.google.maps.Marker({
				position: new window.google.maps.LatLng(loc.location.lat, loc.location.lng),
				animation: window.google.maps.Animation.DROP,
				map: map,
				icon: markerPng
			});

			marker.addListener('click', function () {
				_this.openInfoWindow(marker);
			});

			loc.marker = marker;
			loc.display = true;
			allLocations.push(loc);
		});
		this.setState({ allLocations });
	}

	openInfoWindow(marker) {
		this.closeInfoWindow();
		this.state.infoWindow.open(this.state.map, marker);
		marker.setAnimation(window.google.maps.Animation.BOUNCE);
		setTimeout(() => {
			marker.setAnimation(null);
		}, 2000);
		marker.setIcon(currentMarkerPng);
		this.setState({
			'prevMarker': marker
		});
		this.state.infoWindow.setContent('Please Wait... Loading Data...');
		this.state.map.setCenter(marker.getPosition());
		this.state.map.panBy(0, -200);
		this.getMarkerInfo(marker);
	}

	/* Retrive the location data from the foursquare api for the marker and display it in the infowindow */
	getMarkerInfo(marker) {
		let _this = this;
		let url = "https://api.foursquare.com/v2/venues/search?client_id=" + FOURSQUARE_CLIENT_ID + "&client_secret=" + FOURSQUARE_CLIENT_SECRET + "&v=20180323&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
		fetch(url)
			.then(
				function (response) {
					if (response.status !== 200) {
						_this.state.infoWindow.setContent("<div class='errorSpan'>Error!!! Please try again later</div>");
						return;
					}
					response.json().then( (res) => {
						let venueData = res.response.venues[0];
						let address = (venueData.location.address != undefined) ? venueData.location.address : '';
						let crossStreet = (venueData.location.crossStreet != undefined) ? venueData.location.crossStreet : '';
						let isVerifiedLocation = '<b>Verified Location: </b>' + (venueData.verified ? 'Yes' : 'No') + '<br>';
						let checkInCount = '<b>Number of CheckIn: </b>' + venueData.stats.checkinsCount + '<br>';
						let usersCount = '<b>Number of Users: </b>' + venueData.stats.usersCount + '<br>';
						let tipsCount = '<b>Number of Tips: </b>' + venueData.stats.tipCount + '<br>';
						let fs_link = '<a href="https://foursquare.com/v/'+ venueData.id +'" target="_blank">More on Foursquare</a>'
						let infoHtml = `<div class="infoPopup">
							<h3>${venueData.name}</h3>
							<p class="infoAddress">${address} ${crossStreet}</p>
							${checkInCount}
							${usersCount}
							${tipsCount}
							${isVerifiedLocation} 
							${fs_link}
						</div>`;
						_this.state.infoWindow.setContent(infoHtml);
					});
				})
				.catch(function (err) {
					_this.state.infoWindow.setContent("<div class='errorSpan'>Error!!! Please try again later</div>");
			});
	}


	closeInfoWindow() {
		if (this.state.prevMarker) {
			this.state.prevMarker.setIcon(markerPng);
		}
		this.setState({
			prevMarker: ''
		});
		this.state.infoWindow.close();
	}

	render() {
		return (
			<div>
				<ListPane key="100" allLocations={this.state.allLocations} openInfoWindow={this.openInfoWindow} closeInfoWindow={this.closeInfoWindow} />
				<div id="map" role="application"></div>
			</div>
		);
	}
}

function loadGoogleMap() {
	let ref = window.document.getElementsByTagName("script")[0];
	let script = window.document.createElement("script");
	script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&callback=initMap`;
	script.async = true;
	script.onerror = function () {
		document.write("Error loading Google Maps. Please try again later or Check settings");
	};
	ref.parentNode.insertBefore(script, ref);
}

export default App;