var t = new bwTable();
var db = getLocalStorage() || dispError('Local Storage not supported.');
var addEL = getAddEventListener();

function getLocalStorage() {
	try {
		if( !! window.localStorage ) return window.localStorage;
	} catch(e) {
		return undefined;
	}
}

function getAddEventListener() {
	try {
		if( !! window.addEventListener ) return window.addEventListener;
	} catch(e) {
		return undefined;
	}
}

function eventHandler(e) {
	eventStatus('Event triggered: ' + e.url + ' ' + 
									  e.storageArea.traveler + ' ' + 
									  e.storageArea.destination + ' ' + 
									  e.storageArea.transportation);
	dispResults();
}

function eventStatus(s) {
	if(s) element('eventResult').innerHTML = s;
	else element('eventResult').innerHTML = 'Event status:';
}

function dispResults() {
	if(errorMessage) {
		element('results').innerHTML = errorMessage;
		return;
	}

	if(db) {
		var t = new bwTable();
		t.addRow( ['traveler', db.getItem('traveler')] );
		t.addRow( ['destination', db.getItem('destination')] );
		t.addRow( ['transportation', db.getItem('transportation')] );
		element('results').innerHTML = t.getTableHTML();
	}
	element('travelForm').elements['traveler'].focus();
	element('travelForm').elements['traveler'].select();
}

function dbGo() {
	if(errorMessage) return;
	var f = element('travelForm');
	db.setItem('traveler', f.elements['traveler'].value);
	db.setItem('destination', f.elements['destination'].value);
	db.setItem('transportation', f.elements['transportation'].value);
	eventStatus();
	dispResults(); 
}

function dbClear() {
	if(errorMessage) return;
	db.clear();
	dispResults();
}

function initDisp() {
	if(addEL) {
		addEL('storage', eventHandler, false);
	} else {
		element('eventResult').innerHTML = 'This browser does not support event listeners';
	}
	dispResults();
}

window.onload = function() {
	initDisp();
}