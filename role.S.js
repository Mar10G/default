var utility = require('utility');

var targetObject;
var currentTarget;
 
var S = {
    run: function(creep) 
    {
        try
        {
            //console.log(creep.name + ' got into S');
            
         //   creep.memory.roomToScout   = '8';
            this.recordPower(creep);
            
            var currentRoom = Memory.myMap[creep.pos.roomName];
            
            if(creep.memory.roomToScout == currentRoom || creep.memory.roomToScout == null )
            {
               creep.memory.roomToScout = this.getNextRoom(creep.memory.roomToScout);
            }
            
        //    console.log(creep.name + ' current room is ' + currentRoom + ' - ' + Memory.myMap[currentRoom]);
         //   console.log(creep.name + ' roomToScout is ' + creep.memory.roomToScout + ' - ' + Memory.myMap[creep.memory.roomToScout]);
            
            creep.moveToRoom(Memory.myMap[creep.memory.roomToScout]);
            
         //   console.log('most power = ' + utility.getMostPower());
            
        }
        
    
        
        catch(err)
        {
            console.log(creep.name +  ' err in S = ' + err.toLocaleString());
        }

	},
	
	recordPower: function(creep)
	{
	    var myPower = Memory['Power'];
	    
	    var powerBanks = Game.rooms[creep.pos.roomName].find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_POWER_BANK   } });
	 //   console.log('powerBanks length = ' + powerBanks.length);
	    
	    if(powerBanks.length > 0)
	    {
	        myPower[creep.pos.roomName] = powerBanks[0].power;
	    }
	    else
	    {
	        myPower[creep.pos.roomName] = 0;
	      //  console.log('myPower[creep.pos.roomName] = ' +  myPower[creep.pos.roomName])
	    }
	    
	  //  console.log('mypower length ' + myPower.length);
	    
	    Memory['Power'] = myPower;
	},
	
	getNextRoom: function(currentRoom)
	{
	    var scoutArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9' ];
	    var i = scoutArray.indexOf(currentRoom);
	    
	 //   console.log('indexof = ' + i);
	    
	    if(i == scoutArray.length)
	    {
	        return scoutArray[0];
	    }
	    else
	    {
	        return scoutArray[i + 1];
	    }
	}
	
};

module.exports = S;