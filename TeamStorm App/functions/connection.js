

 function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 1;
	states[Connection.NONE]     = 2;
	states[Connection.CELL]     = 3;
    states[Connection.ETHERNET] = 4;
    states[Connection.WIFI]     = 5;
    states[Connection.CELL_2G]  = 6;
    states[Connection.CELL_3G]  = 7;
    states[Connection.CELL_4G]  = 8;
   
   

     return states[networkState];
} 
  