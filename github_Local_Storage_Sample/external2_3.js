var t = new bwTable();
var db = getLocalStorage() || dispError('Local Storage not supported.');

function getLocalStorage() {
	try {
		if (!! window.localStorage) return localStorage;	
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
	
	var t = new bwTable();
	t.addRow(['traveler', db.getItem('traveler')]);
	t.addRow(['destination', db.getItem('destination')]);
	t.addRow(['transportation', db.getItem('transportation')]);
	element('results').innerHTML = t.getTableHTML();
}

function dbGo() {
	if (errorMessage) return;
	var f = element('travelForm');
	db.setItem('traveler', f.elements['traveler'].value);
	db.setItem('destination', f.elements['destination'].value);
	db.setItem('transportation', f.elements['transportation'].value);
	dispResults();
}

function dbClear() {
	if (errorMessage) return;
	db.clear();
	dispResults();	
}

function initDisp() {
	dispResults();	
}

window.onload = function() {
	initDisp();	
}