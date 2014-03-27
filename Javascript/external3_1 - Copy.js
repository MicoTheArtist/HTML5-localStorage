var db = prepareDatabase();
var createSQL = 'create table if not extsts tTravel (' +
				'id integer primary key,' +
				'traveler TEXT,' +
				'destination TEXT,' +
				'transportation TEXT' +
	')';
	
	
// Check if this browser supports Web SQL
function getOpenDatabase() {
	try {
		if (!! window.openDatabase) return window.openDatabase;
		else return undefined;
	}
	catch(e) {
		return undefined;
	}
}

// Open the Web SQL database
function prepareDatabase() {
	var odb = getOpenDatabase();
	if (!odb) {
		dispError('Web SQL Not Supported');
		return undefined;
	}
	else {
		var db = odb('testDatabase', '1.0', 'A Test Database', 10 * 1024 * 1024);
		db.transaction(function(t) {
			t.executeSql(createSQL, [], function(t,r) {  // r object is where we get our results
					alert('Create table, rows affected: ' + r.rowsAffected);
			}, function(t,e) {	// create the sql , empty array, run this on success, run this on failure
				alert('create table: ' + e.message);
			});
		});
		return db;
	}
}

// How many rows do we have?
function countRows() {
	if (!db) return;
	db.readTransactoin(function(t) {
		t.executeSql('SELECT COUNT(*) AS c FROM tTravel', [], function (t,r) {
			var c = r.rows.item(0).c;  // must atleast get this to verify that we have atleast one row
			element('rowCount').innerHTML = c ? c : 0;
		}, function (t, e) {  // t object represents the sql transaction, if their is an error in the transaction e will have a message
			alert('countRows: ' + e.message);
		});
	});
}

// Create the Edit and Delete buttons for a row
function rowButtons(id, traveler) {
	return '<form><input type="button" value="edit" onClick="javascript:editGo('+ id +')"/>' +
				'<input type="button" value="Delete" onClick="javascript:deleteGo(' + id +', &quot;' + traveler + '&quot;)"/></form>';	
}

// Main display function
function dispResults() {
	if (errorMessage) {
		element('results').innerHTML = errorMessage;
		return;
	}
	
	countRows();
	
	if (db) {	
		db.readTransaction(function(t) {	// readTransaction sets teh database to read-only
			t.executeSql('select * from tTravel order by LOWER(traveler)', [], function(t, r) {  // NOTE: Lower sets the string to lowercase and makes the string case insensitive
				var bwt = new bwTable();
				bwt.setHeader(['Traveler', 'Destination', 'Transportation', '']);
				for (var i = 0; i<r.rows.length; i++) {
					var row = r.rows.item(i);
					bwt.addRow([row.traveler, row.destination, row.transportation, rowButons(row.id, row.traveler)]);  // NOTE: edit / delete buttons are just place holders where I will add buttons later on
				}
				element('results').innerHTML = bwt.getTableHTML();
				element('travelForm').elements['traveler'].focus();  // give the traveler element focus turning on it's focus css value
			});
		});
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
		db.transaction(function(t) {
			t.executeSql('insert into tTravel (traveler, destination, transportation) values (?,?,?)', 
				[traveler, destination, transportation]
			);
		}, function(t, e) { 
			alert('Insert row: ' + e.message);
		}, function() {
			resetTravelForm();
		});
		break;
	case 'update':
		if (! (traveler || destination || transportation)) break;
		db.transaction(function(t) {
			t.executeSql('update tTravel SET traveler = ?, destination = ?, transportation = ? where id =?',
				[traveler, destination, transportation, key]
			);
		}, function (t,e) {
			'Update row: ' + e.message;
		}, function() {
			resetTravelForm();
		});
		break;
	}
	dispResults();
}

// update the edited row
function editGo(id) {
	db.readTransaction(function(t) {
		t.executeSql('select * from tTravel where id = ?', [id], function(t, r) {
			var row = r.rows.item(0);
			if (row) {
				var f = element('travelForm');
				f.elements['traveler'].value = row.traveler;
				f.elements['destination'].value = row.destination;
				f.elements['transportation'].value = row.transportation;
				f.elements['goButton'].value = 'Update';
				f.elements['inputAction'].value = 'update';
				f.elements['key'].value = row.id;
				f.elements['traveler'].focus();
				f.elements['traveler'].select();
			}
		});
	});
}

// confirm and delete a row
function deleteGo(id, traveler) {
	if (confirm('Delete' + traveler + ' (ID: ' + id + ')?')) {
		db.transaction(function(t) {
			t.executeSql('Delete from tTravel where id = ?', [id]);
		})
		resetTravelForm();
		dispResults();
	}
}

// clear all the form fields and rest the button and action elements
function restTravelForm() {
	var f = element('travelForm');
	for (var n in ['traveler', 'destination', 'transportation', 'key']) {
		f.elements[n].value = '';
	}
	f.elements['inputAction'].value = 'add';
	f.elements['goButton'].value = 'Add';
}

// delete all the rows in the table
function clearDB() {
	if (confirm('Clear the entinre table?')) {
		db.transaction(function(t){
			t.executeSql('DELETE FROM tTravel');
		});
		dispResults();
	}
}

function initDisp() {
	dispResults();	
}

window.onload = function() {
	initDisp();
}

