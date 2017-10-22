var currentRoomName;
var targets;
var jobsArray;
var currentJob;
var forceWar = false;
var baseThreshold = 200;


var utility = {

    defendRoom: function(roomName) 
    {
    
       //  console.log('defending ' + roomName);
         
         var theSpawns = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}});
         
         if (theSpawns.length > 0)
         {
                var spawnHealth = theSpawns[0].hits;
         
       //  spawnHealth = 1;
         
      //   console.log('spawnHealth =  ' + spawnHealth);
         
            if (spawnHealth < 5000)
            {
                console.log('that not good' );
                Game.rooms[roomName].controller.activateSafeMode();
                
            }
         }
         
      
    
        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        var wounded = Game.rooms[roomName].find(FIND_MY_CREEPS, {filter: function(object) {return ( object.hits < object.hitsMax );} } );   
        
        if(hostiles.length > 0) 
        {
            Memory.roomsAtWar.push(roomName);
        
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
        
            var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        
            towers.forEach(tower => tower.attack(hostiles[0]));
            return;
        }
        
        if(wounded.length > 0) 
        {
            console.log('wounded creeps ' + wounded.length);
            
            var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        
            towers.forEach(tower => tower.heal(wounded[0]));
        }
    },
    
    startPrint: function(toStart)
    {
        console.log('\n --------------START ' + toStart);
    },
    
    endPrint: function(toStart)
    {
        console.log(' --------------END ' + toStart + ' \n');
    },


    getMostPower: function()
    {
        var maxPower = 100;
        var maxRoom = -1
    
        for (var prop in  Memory['Power']) 
        {
            if(Memory['Power'][prop] > maxPower)
            {
                maxPower = Memory['Power'][prop];
                maxRoom = prop;
                 
             //   console.log( prop );
             //   console.log(Memory['Power'][prop]);
            }
        }

        return maxRoom;
    },
    
    getLowThreshold: function(theRoom)
    {
        var valueToReturn = 1;
        
        try
        {
            valueToReturn = baseThreshold * ( theRoom.controller.level * theRoom.controller.level * theRoom.controller.level) * Memory.thresholdIncreaser;
        }
        catch(err)
        {
            
        }
        return valueToReturn;
        
        
        
        
        
      //  Memory.thresholdIncreaser = 1;
        
     //   console.log(theRoom + ' baseThreshold = ' + baseThreshold);
      //  console.log(theRoom + ' theRoom.controller.level = ' + theRoom.controller.level);
       // console.log(theRoom + ' Memory.thresholdIncreaser = ' + Memory.thresholdIncreaser);
        var valueToReturn = baseThreshold * ( theRoom.controller.level * theRoom.controller.level) * Memory.thresholdIncreaser;
     //   console.log(theRoom + ' low threshold = ' + valueToReturn);
        return valueToReturn;
    },
    
    getHighThreshold: function(structureID)
    {
        var theObject =  Game.getObjectById(structureID);
        var theRoom = theObject.room;
        
     //   console.log(theRoom);
        
        var valueToReturn = 3 * this.getLowThreshold(theRoom);
      //  console.log('high threshold = ' + valueToReturn);
        return valueToReturn;
    
    },
    
    json2Array: function(json)
    {
        var result = [];
        var keys = Object.keys(json);
    
        keys.forEach(function(key){
            result.push(json[key]);
        });
        
    return result;
    },
    
    
    
    sendEmailStatus: function()
    {
        Game.notify(this.logGCL());
        
        
        
        Game.notify(  this.getRoomStatus(Memory.myMap['3'])       );
        Game.notify(  this.getRoomStatus(Memory.myMap['I'])       );
        Game.notify(  this.getRoomStatus(Memory.myMap['J'])       );
        Game.notify(  this.getRoomStatus(Memory.myMap['K'])       );
        
        Game.notify(  this.getRoomEnergyStatus(Memory.myMap['3'])    );
        Game.notify(  this.getRoomEnergyStatus(Memory.myMap['I'])    );
        Game.notify(  this.getRoomEnergyStatus(Memory.myMap['J'])    );
        Game.notify(  this.getRoomEnergyStatus(Memory.myMap['K'])    );
      
        Game.notify('Memory.thresholdIncreaser = ' + Memory.thresholdIncreaser);
        
      //  Game.notify(  this.getMineralStatus(Memory.myMap['I'])   );
     //   Game.notify(  this.getMineralStatus(Memory.myMap['3'])   );
     //   Game.notify(  this.getMineralStatus(Memory.myMap['J'])   );
     //   Game.notify(  this.getMineralStatus(Memory.myMap['K'])   );
        
        Game.notify('Min: ' + Memory.MINcpu + ', Max: ' + Memory.MAXcpu + ', Avg: ' + Memory.AVGcpu   );
    },
    
    
    /*
    buildStatus: function()
    { 
        var stringToReturn = ' ';
        
        stringToReturn = '\n' +  stringToReturn + this.logGCL() ;
        
        stringToReturn = '\n' +  stringToReturn + this.getMineralStatus(Memory.myMap['P']) ;
        
        stringToReturn = '\n' +  stringToReturn + this.getRoomStatus(Memory.myMap['O']);
        stringToReturn = '\n' +  stringToReturn + this.getRoomStatus(Memory.myMap['P']);
        
        stringToReturn = '\n' +  stringToReturn + this.getRoomEnergyStatus(Memory.myMap['O']);
        stringToReturn = '\n' +  stringToReturn + this.getRoomEnergyStatus(Memory.myMap['P']);
        
        return stringToReturn;
    },
    */
    
    
    getRoomStatus: function(theRoomName)
    {
        console.log('Room status ' + Memory.roomStatus[theRoomName]);
        return  Memory.roomStatus[theRoomName] ;
    },
    
    
    getMineralStatus: function(theRoomName)
    {
        var stringToReturn = ' ' ;
        var currentMineral;
        var quant;
        var i = 0;
        var myColor = '997755';
        var myBuyColor = '8888FF';
        var mySellColor = '228822';
            
        for(i=0; i < Memory.myMinerals.length; i++)
        {
            
            currentMineral = Memory.myMinerals[i];
            quant = utility.getAmountInTerm(currentMineral.mineralName, theRoomName);
            
            myColor = '997755';
            if(currentMineral.isBuy){myColor = myBuyColor};
            if(currentMineral.isSell){myColor = mySellColor};
     
    
            stringToReturn = stringToReturn + '<font color=' + myColor + '>' +  currentMineral.mineralName + ': ' + quant + '</font>, ' ;
        }
    
        return stringToReturn  ;  //'test \n test 2';
    },
    
    getAmountInTerm: function(resource, myRoomName)
    {
        try
        {
        var myStore = Game.rooms[myRoomName].terminal.store;
        
       // console.log(JSON.stringify(myStore));
      //  var jsonHash = JSON.parse(JSON.stringify(myStore));
        
        if(myStore[resource] > 0)
        {
            return myStore[resource];
        }
        else
        {
            return 0;
        }
        }
        catch(err)
        {
         //   console.log(err.toString());
        }
    },
    
    runLabs: function(roomName)
    {
        return;
        
        targets = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LAB });
        
        if(targets.length > 1)
        {
        
            if(targets[0].mineralAmount > 100 && targets[1].mineralAmount > 100 )
            {
                targets[2].runReaction(targets[0], targets[1]);
            }
        
        }
        
        
    },
    
    transferPower: function(fromLink, toLink)
    {
        if(fromLink.energy > 100 && toLink.energy < 700)
        {
            fromLink.transferEnergy(toLink);
        }
    },
    
    movePower: function(roomName)
    {
        
        try
        {
            var links = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
    
            if(roomName == Memory.myMap['J'] || roomName == Memory.myMap['I'])
            {
                var linkFrom = links[0];
                var linkTo = links[1];
            }
            else
            {
                var linkFrom = links[1];
                var linkTo = links[0];
            }
            
            linkFrom.transferEnergy(linkTo);
        }
        
        catch(err)
        {
            
            
        }
        
        return;
        
        
            
        console.log('moving power ' + roomName);
        
        if(roomName == Memory.myMap['I'])
        {
            var links = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
    
            var linkFrom = links[0];
            var linkTo = links[1];
            
            linkFrom.transferEnergy(linkTo);
        }
        
        
         if(roomName == Memory.myMap['J'])
        {
            var links = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
    
            var linkFrom = links[0];
            var linkTo = links[1];
            
            linkFrom.transferEnergy(linkTo);
        }
        
        
         if(roomName == Memory.myMap['K'])
        {
            var links = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
    
            var linkFrom = links[1];
            var linkTo = links[0];
            
            linkFrom.transferEnergy(linkTo);
        }
    }, 
    
    
    getOwner: function(roomToCheck)
    {
        try
        {
            myOwner = roomToCheck.controller.owner.username;
            return  myOwner ;
        }
        catch(err)
        {
          //  console.log(err.toString());
            return null;
            
        }
    },
    
    getRoomByLetter: function(letterToCheck, myCreep)
    {
        var roomToReturn;
        
        if(letterToCheck == 'Z')
        {
            roomToReturn = myCreep.pos.roomName;
        }
        else
        {
            roomToReturn = Memory.myMap[letterToCheck];
        }
      
       // console.log('room to return = ' + roomToReturn)
        return roomToReturn
    },
    
    isWar: function()
    {
        if(forceWar || Memory.roomsAtWar.length > 0)
        {
            console.log('<font color=FF3333> WAR IN ROOM ' + Memory.roomsAtWar[0]  +  '</font>');
            
            return true;
        }
        
        return false;
    },
    
    logGCL: function()
    {
        var GCLlevel = Game.gcl.level;
        var GCLprogress = Game.gcl.progress;
        var GCLprogressTotal = Game.gcl.progressTotal;
        var GCLpercent = 100 * (GCLprogress / GCLprogressTotal);
        
        GCLpercent = parseFloat(GCLpercent).toFixed(4);
        
        return 'GCL level: ' + GCLlevel + '. ' + GCLprogress.toLocaleString() + ' of ' + GCLprogressTotal.toLocaleString() + ' progress. '  + GCLpercent + ' percent.';
      //  console.log('  ');
    },
    
    
    getClosestNotFullEnergyHolder: function(roomsToCheck, creepPos)
    {
       // console.log(roomToCheck)
        var i
        for(i=0; i < roomsToCheck.length; i++)
        {
            currentRoomName = roomsToCheck[i];
           // console.log('Checking ' + currentRoomName);
            
            targets = Game.rooms[currentRoomName].find(FIND_STRUCTURES, { filter: (i) => 
                (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] < 2000) || 
                (i.structureType == STRUCTURE_LINK && i.energy < 800)    });
                
          //   console.log('Room ' + currentRoomName + ' has ' + targets.length + ' targets');   
             
             if(targets.length > 0)
             {
                if(creepPos.roomName == currentRoomName)
                {
                    return creepPos.findClosestByPath(targets);
                }
                else
                {
                    return targets[0];
                }
             }
            
            
        }
        
        return null;
    },
    
    getRoomEnergyStatus: function(myRoomName)
    {
        try
        {
            var myEnergy;
            var myEnergyCap;
        
            //console.log('myRoomName ' + myRoomName);
                 
            myEnergy = Game.rooms[myRoomName].energyAvailable;
            myEnergyCap = Game.rooms[myRoomName].energyCapacityAvailable;
            myProgress = Game.rooms[myRoomName].controller.progress;
            myProgressTotal = Game.rooms[myRoomName].controller.progressTotal;
            myLevel = Game.rooms[myRoomName].controller.level;
            
            myPercent = 100 * (myProgress / myProgressTotal);
            myPercent = parseFloat(myPercent).toFixed(4);
            
            myColor =  parseFloat(myPercent).toFixed(0);
            
            
           
            return myRoomName + ' has '+myEnergy + ' energy, ' +myEnergyCap + ' energyCap, cont level ' + myLevel + '. <font color=' + myColor + '9999>Upgrade ' + myPercent + '% complete.</font>';
        } 
        catch(err)
        {
            return err.toString();
            
        }
        //return 'getRoomEnergyStatus';
    },
    
    markJob: function(myGuid, creepName)
	{
	  //  console.log('trying to mark ' + myGuid);
	    
	    jobsArray = Memory.jobs;
	    var i;
	    
	    for(i=0; i < jobsArray.length; i++)
	    {
	       currentJob = jobsArray[i];
	        
	       if(currentJob.guid == myGuid) 
	       {
	        //   console.log('found ' + myGuid);
	           Memory.jobs[i].droneName = creepName;
	         //   console.log(i);
	         //   console.log(Memory.jobs[i].droneName);
	           return ;
	           
	       }
	    }  
	},
	
	
    getJobByLocation: function(locationToFind)
	{
	    jobsArray = Memory.jobs;
	    for(i=0; i < jobsArray.length; i++)
	    {
	        currentJob = jobsArray[i];
	        if(currentJob.myLocation.x == locationToFind.x && currentJob.myLocation.y == locationToFind.y && currentJob.roomName == locationToFind.roomName) {return currentJob;}
	    }   

        return Memory.jobs[0];
	},
    
    getJobByDroneName: function(creepName)
    {
      	
      	jobsArray = Memory.jobs;
	    
	    var i;
	    for(i=0; i < jobsArray.length; i++)
	    {
	        currentJob = jobsArray[i];
	        if(currentJob.droneName == creepName) {return currentJob;}
	    }  
	    
      return null;  
    },
    
    getJob: function(creepPos, creepName) 
	{
	    if(Memory.jobs.length == 0)
	    {
	        console.log('zero jobs');
	        return null;
	    }
	    
	    if(Memory.jobs.length == 1)
	    {
	        console.log('one job');
	        return Memory.jobs[0];
	    }
	    
	    var highestPriority; 
	    highestPriority = this.getHighestPriority();
	    
	   // console.log('highestPriority =' + highestPriority);
	    

	    currentJob = this.getJobByDroneName(creepName);
	    if(currentJob != null && currentJob.priority >= highestPriority) 
	    {
	        return currentJob;
	    }
	    else
	    {
	      //  console.log('current job is null');
	    }
	    


        
        
        
	   return this.getAnyJob(highestPriority, creepName); 
	   /*     
	       
	        jobToReturn = this.getClosestJob(highestPriority, creepPos);
	        if(jobToReturn == null)
	        {
	            console.log('Closest is null!!!');
	            jobToReturn = this.getAnyJob(highestPriority); 
	            
	        }
	        
	     //   console.log('returning ' + jobToReturn);
	        return jobToReturn;
	        
	        console.log('!!!!!!!!!!!!!!!!!!!!');
	        
	        console.log('locations.length =' +locations.length);
	        console.log(closest);
	        
	        if(closest == null)
	        {
	            console.log('Closest is null!!!');
	            return Memory.jobs[0];
	            
	        }
	        
	        jobsArray = Memory.jobs;
	        for(i=0; i < jobsArray.length; i++)
	        {
	            currentJob = jobsArray[i];
	            if(currentJob.myLocation.x == closest.x && currentJob.myLocation.y == closest.y && currentJob.roomName == closest.roomName) {return currentJob;}
	        }   

	        return Memory.jobs[0];
	     
	    return false;    
	    */
	} ,
	
	getHighestPriority: function()
	{

	   var highestPriority = 0;
	        
	   jobsArray = Memory.jobs;
	   for(i=0; i < jobsArray.length; i++)
	   {
	       currentJob = jobsArray[i];
	       if(currentJob.priority > highestPriority && currentJob.droneName.length < 2) 
	       {
	           highestPriority = currentJob.priority;
	           
	       }
	   }
	        
	   return highestPriority ;
	},
	
	getAnyJob:function(priority, creepName)
	{
	    
	 //   console.log(priority);
	 //   console.log(creepName);
	    
	    
	    jobsArray = Memory.jobs;
	    var i;
	    
	    if (priority > 99)
	    {
	        for(i=0; i < jobsArray.length; i++)
	        {
	            currentJob = jobsArray[i];
	        
	            if(currentJob.priority == priority) 
	            {
	                return currentJob;
	            }
	        } 
	        
	    }
	    
	    /*
	    for(i=0; i < jobsArray.length; i++)
	    {
	        currentJob = jobsArray[i];
	        
	        if(currentJob.droneName == creepName) 
	        {
	            return currentJob;
	        }
	    } 
	    */
	    
	    for(i=0; i < jobsArray.length; i++)
	    {
	     //   console.log('looking for job');
	        
	        currentJob = jobsArray[i];
	        
	        if(currentJob.droneName == creepName) 
	        {
	      //      console.log(creepName + ' first part going to return ' + JSON.stringify(currentJob));
	            return currentJob;
	        }
	        
	        if(currentJob.priority == priority && currentJob.droneName.length < 2) 
	        {
	         //   console.log('going to return ' + currentJob);
	            return currentJob;
	        }
	    } 
	    
	  //  console.log('got to end going to return ' + Memory.jobs[0]);
	    return Memory.jobs[0];
	},
	
    
    getClosestNotEmptyEnergyHolder: function(roomsToCheck)
    {
       // console.log(roomToCheck)
        var i
        for(i=0; i < roomsToCheck.length; i++)
        {
            currentRoomName = roomsToCheck[i];
        //    console.log('Checking ' + currentRoomName);
            
            targets = Game.rooms[currentRoomName].find(FIND_STRUCTURES, { filter: (i) => 
                (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0) || 
                (i.structureType == STRUCTURE_LINK && i.energy > 0)    });
                
        //     console.log('Room ' + currentRoomName + ' has ' + targets.length + ' targets');   
             
             if(targets.length > 0)
             {
                return targets[0];
             }
            
            
        }
        
        return null;
    },
    
   
    
    getClosestNotEmptyContainer: function(roomsToCheck)
    {
        try
        {
            // console.log(roomToCheck)
            var i
            for(i=0; i < roomsToCheck.length; i++)
            {
                currentRoomName = roomsToCheck[i];
             //   console.log('Checking ' + currentRoomName);
            
                targets = Game.rooms[currentRoomName].find(FIND_STRUCTURES, { filter: (i) => 
                    (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 299)    });
                
               
             
             if(targets.length > 0)
             {
          //       console.log('Room ' + currentRoomName + ' has ' + targets.length + ' targets'); 
                return targets[0];
             }
             else
             {
          //       console.log('Room ' + currentRoomName + ' has zero targets'); 
             }
            
            
        }
        }
        
        catch(err)
        {
            console.log(err.toString());
        }
        
        return null;
    },
    
 
    
    isOnInterval: function(interval)
    {
      //  return true;
        
        if(Game.time % interval == 0) {return true;}
        return false;
    },
    
    
    
    
    
    
    hello: function()
    {
       // console.log('hello world');    
    }
}
module.exports = utility;