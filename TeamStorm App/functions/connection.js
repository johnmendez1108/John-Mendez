

 function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 0;
	 states[Connection.NONE]     = 1;
	states[Connection.CELL]     = 2;
    states[Connection.ETHERNET] = 3;
    states[Connection.WIFI]     = 4;
    states[Connection.CELL_2G]  = 5;
    states[Connection.CELL_3G]  = 6;
    states[Connection.CELL_4G]  = 7;
   
   

     return states[networkState];
} 
  