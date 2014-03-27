<!doctype html>
<html manifest="start.manifest">
<head>
	<title>sessionStorage example with manifest file</title>
    <link rel="stylesheet" type="text/css" href="../CSS/main.css">
    <script src="../Javascript/bwH5LS.js"></script>
    <script src="../Javascript/external6.js"></script>
</head>
<body>
<div id="content"> <!-- entire body wrapper -->
	<img src="exp-calif-logo.gif" style="float: left; margin-right: 10px"/>
	<h1>sesionStorage example with manifest file</h1>
    <div id="form">
    	<form id="travelForm">
        	<table class="form">
            	<tr>
                	<td class="label">Traveler</td>
                    <td><input type="text" name="traveler"></td>
                </tr>
                <tr>
                	<td class="label">Destination</td>
                    <td><input type="text" name="destination"></td>
                </tr>
                <tr>
                	<td class="label">Transportation</td>
                    <td><input type="text" name="transportation"></td>
                </tr>
                <tr>
                	<td class="button" colspan="2">
                    	<input type="button" value="Clear" onClick="javascript:dbClear()">
                        <input type="button" value="Go" onClick="javascript:dbGo()">
                    </td>
                </tr>
            </table>
		<input id="inputAction" type="hidden" name="action" value="add">
        <input id="inputKey" type="hidden" name="key" value="0">
        </form>
    </div>
    
    <div id="results">
    <!-- results show here -->
    </div>
</div>
</body>
</html>