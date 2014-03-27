var db;
var dbVersion = '1.0';
openDB();

// Check if this browser supports indexedDB
function getIndexedDB() {
	try {
		if (! window.indexedDB) window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB;
		if (!! window.indexedDB) return window.indexedDB;
		else return undefined;
	}
	catch(e) {
		return undefined;
	}
}

// global error handler for indexedDB
function dbErrorHandler(event) {
	dispError('Database error: ' + event.target.errorCode);	
}

// set up the new indexedDB
function openDB() {
	var iDB = getIndexedDB();
	if(!iDB) {
		dispError('IndexedDB not supported.');
		return;
	}
	else {
		try {
			var request = iDB.open('travelDB', 'demo travel database');
			request.onerror = function(event) { errorDisplay('Failed to open IndexedDB database.'); }
			request.onsuccess = function(event) {
				db = request.result;
				db.onerror = dbErrorHandler;
				if (db.version != dbVersion) {
					var req = db.setVersion(dbVersion);
					req.onerror = function(event) { alert('version error: ' + event.target.errorCode); }
					req.onsuccess = function(event) {
						alert('Creating the object store.');
						var objectStore = db.createObjectStore('oTravel', { keyPath: 'id', autoIncrement: true });
						objectStore.createIndex('traveler', 'ciTraveler', { unique: false });
					}
				}
			}
		}
		catch(e) {
			dispError('Browser supports IndexedDB but didn\'t open the database. ('+e.message+')');
		}
	}
}

// sometimes the database takes a moment to open
// provide a retry for the dispResults() function
var retryCount = 0;
function retryDisp() {
	if (++retryCount > 5) {
		errorDisp('Cannot open the database after 5 retries');	
		dispResults();
	}
	setTimeout('dispResults()', 100);
}

// Create the Edit and Delete buttons for a row
function rowButtons (id, traveler) {
	return 	'<form>'+
    			'<input type="button" value="Edit" onClick="javascript:editGo('+id+')">'+
        		'<input type="button" value="Delete" onClick="javascript:deleteGo('+id+', &quot;'+traveler+'&quot;)" >'+
    		'</form>';
}

// Main display function  --- return the info from the indexedDB
function dispResults() {
	if (errorMessage) {
		element('results').innerHTML = errorMessage;
		return;
	}
	
	if (db) {
		var bwt = new bwTable();
		bwt.setHeader(['traveler', 'Destination', 'Transportation','']);
		var count = 0;
		var objectStore = db.transaction('oTravel').objectStore('oTravel');
		var indexTraveler = objectStore.index('traveler');
		indexTraveler.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				var v = cursor.value;
				bwt.addRow([v.traveler, v.destination, v.transportation, rowButtons(v.id, v.traveler)]);
				count++;
				cursor.continue();
			}
			else {
				element('rowCount').innerHTML = count;
				element('results').innerHTML = bwt.getTableHTML();
				element('travelForm').elements['traveler'].focus();
			}
		}
	}
}

// add or update rows in the table
function dbGo() {
	if (errorMessage) return;
	var f = element('travelForm');
	var action = f.elements['inputAction'].value;
	var traveler = f.elements['traveler'].value;
	var destination = f.elements['destination'].value;
	var transportation = f.elements['transportation'].value;
	var key = f.elements['key'].value;
	
	switch(action) {
	case 'add':
		if (!(traveler || destination || transportation)) break;
		curRec = { traveler: traveler, destination: destination, transportation: transportation, ciTraveler: traveler.toLowerCase() }
		db.transaction('oTravel', IDBTransaction.READ_WRITE).objectStore('oTravel').add(curRec);
		break;
	case 'update':
		if (!(!traveler || destination || transportation)) break;
		curRec = { traveler: traveler, destination: destination, transportation: transportation, ciTraveler: traveler.toLowerCase() }
		var objectStore = db.transaction('oTravel', IDBTransaction.READ_WRITE).objectStore('oTravel');
		objectStore.delete(key).onsuccess = function(event) {
			objectStore.add(curRec);	
		}
		break;
	}
	resetTravelForm();
	dispResults();
}


// update the edited row
function editGo(id) {
	db.transaction('oTravel').objectStore('oTravel').get(id).onsuccess = function(event) {
		rec = event.target.result;
		if (rec) {
			var f = element('travelForm');
			f.elements['traveler'].value = rec.traveler;
			f.elements['destination'].value = rec.destination;
			f.elements['transportation'].value = rec.transportation;
			f.elements['goButton'].value = 'Update';
			f.elements['inputAction'].value = 'update';
			f.elements['key'].value = rec.id;
			f.elements['traveler'].focus();
			f.elements['traveler'].select();
		}
	}
}


// confirm and delete a row
function deleteGo(id, traveler) {
	if (confirm('Delete '+traveler+' (ID: '+id+')')) {
		db.transaction('oTravel', IDBTransaction.READ_WRITE).objectStore('oTravel').delete(id);
		resetTravelForm();
		dispResults();
	}
}

// clear all the form fields and rest the button and actin elements
function resetTravelForm() {
	var f = element('travelForm');
	for (var n in ['traveler', 'destination', 'transportation', 'key']) {
		f.elements[n].value = '';
	}
	f.elements['inputAction'].value = 'add';
	f.elements['goButton'].value = 'Add';
}

// delete all the recs in th store
function clearDB() {
	if (confirm('Clear the entire table?')) {
		db.transaction('oTravel', IDBTransaction.READ_WRITE).objectStore('oTravel').clear();
		resetTravelForm();
		dispResults();
	}
}

function initDisp() {
	dispResults();	
}

window.onload = function() {
	initDisp();
}















