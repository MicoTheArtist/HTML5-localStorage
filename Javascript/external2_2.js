var t = new bwTable();
var db = getLocalStorage() || dispError('Local Storage not supported');

function getLocalStorage() {
	try {
		if (!! window.localStorage) return window.localStorage;	
	}
	catch(e) {
		return undefined;
	}
}

function dispResults() {
	if (errorMessage) {
		element('results').innerHTML = errorMessage;
		return;
	}
	
	db.setItem('travler', 'Bill');
	db.setItem('destination', 'Ventura');
	db.setItem('transportation', 'Airplane');
	
	var t = new bwTable();
	t.addRow(['traveler', db.getItem('traveler')]);
	t.addRow(['destination', db.getItem('destination')]);
	t.addRow(['transportation', db.getItem('transportation')]);
	element('results').innerHTML = t.getTableHTML();
}

function dbGo() {
	if (errorMessage) return;
	dispResults();	
}

function initDisp() {
	dispResults();	
}

window.onload = function() {
	initDisp();
}