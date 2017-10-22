var utility = require('utility');

var targetObject;
var currentTarget;
 
var Z = {
    run: function(creep) 
    {
        try
        {
         //   console.log(creep.name + ' got into Z');
            
          //  creep.moveTo(new RoomPosition(25, 20, creep.getFromRoom()));
         //   return;
            
            
            creep.memory.action = 'power'
            if(creep.goToRoomStatus() == 2) { return; }
               
              
          
                var myCreep =   this.getSameHome(creep);
            //    console.log(myCreep.toLocaleString());
                if(creep.heal(myCreep) == ERR_NOT_IN_RANGE){creep.moveTo(myCreep);}
          
            
        }
        
        
        
        
        catch(err)
        {
            console.log(creep.name +  ' err in Z = ' + err.toLocaleString());
        }

	},
	
	getWeakestCreep: function(myCreep)
	{
	    var wounded = Game.rooms[myCreep.pos.roomName].find(FIND_MY_CREEPS, {filter: function(object) {return ( object.hits < object.hitsMax );} } ); 
	    var creepToReturn = wounded[0];
	    var lowestPercent = 101;
	    
	    for(i=0; i < wounded.length; i++)
	    {
	        var currentCreep = wounded[i];
	        var myPercent = currentCreep.hits / currentCreep.hitsMax;
	        
	        if(myPercent < lowestPercent)
	        {
	            lowestPercent = myPercent;
	            creepToReturn = currentCreep;
	        }
	        
	        console.log(myPercent);
	    }
	    
	    return creepToReturn;
	}
	,
	
	getSameHome: function(myCreep)
	{
	    var wounded = Game.rooms[myCreep.pos.roomName].find(FIND_MY_CREEPS, {filter: function(object) {return ( object.hits < object.hitsMax );} } ); 
	  //  var creepToReturn = wounded[0];
	  //  var lowestPercent = 101;
	    
	    for(i=0; i < wounded.length; i++)
	    {
	    //    console.log(wounded[i].memory.homeRoom);
	        if(myCreep.memory.homeRoom == wounded[i].memory.homeRoom)
	        {
	            return wounded[i];
	        }
	        
	     //   console.log(myPercent);
	    }
	    
	   return this.getWeakestCreep(myCreep);
	}
	
};

module.exports = Z;