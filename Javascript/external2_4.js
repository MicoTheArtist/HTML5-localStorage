
var t = new bwTable();
var db = getSessionStorage() || dispError('Session Storage not supported.');

	function getSessionStorage() {
		try {
			if (!! window.sessionStorage) return window.sessionStorage;	
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
