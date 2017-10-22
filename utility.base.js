var utility = require('utility');

var utilityBase = {

    creepBase: function()
    {
        Creep.prototype.testy = function() 
        {
            //console.log("HELLO Hello world"); 
        }
        
        Creep.prototype.runMe = function(myRole)
        {
            if(myRole == 'E')  {this.E() }
       //     else     {console.log('myRole = ' + myRole)}
        }
        
        Creep.prototype.moveToRoom = function(myRoomName)
        {
            
            this.moveTo(new RoomPosition(25, 25, myRoomName), {visualizePathStyle: { fill: 'transparent',    stroke: '#FF0000', lineStyle: 'dashed',    strokeWidth: .10,  opacity: .1}});
        }
    
    
        
        Creep.prototype.E = function()
        {
            
        //    console.log(this.name + ' do E stuff ' );
            
            try
            {
                if(this.handleBoost('capacity', 1))
                {
                //  console.log(creep.name + 'boost handled, continue');
                }
                else
                {
                //  console.log(creep.name + 'boost NOT handled, STOP');
                    return;
                }
            
             
                this.setAction();
              
            
                if(this.goToRoomStatus() == 2) // checking for in wrong room
                {
                    return;
                }
                
         
            
                if(this.memory.action == 'charge')
                {
                    this.chargeFromClosestContainerOrLink();
                    return;
                }
                
           
            
                if(this.memory.action == 'doWork')
                {
                    var extensionsFull = this.depositToClosestExtension();
                //   console.log('extensionFull = ' + extensionsFull );
                // console.log(this.name + 'got here 6' );
                
                    if (extensionsFull)
                    {
                        var spawnsFull = this.depositToClosestSpawn();
                //        console.log('spawnsFull = ' + spawnsFull );
                    }
   
                    return;
                }
                
            }
         
            
            catch(err)
            {
                console.log('<font color=FF3333>Charge Ext catch =' + err.toString() + '</font>');
            }
        }
           
        
        
        Creep.prototype.harvestEnergy = function(energySource)
        {
            var sources = this.room.find(FIND_SOURCES);

            if(this.harvest(sources[energySource]) == ERR_NOT_IN_RANGE) 
            {
                this.moveTo(sources[energySource]);
                return 1;
            }
            else
            {
                return sources[energySource].energy;
            }
            return 2;
        }
        
        Creep.prototype.recycleMe = function()
        {
            console.log('recycle ' + this.name) ;
            
            var myRoomName = this.pos.roomName;
            console.log(myRoomName)
            var mySpawns = Game.rooms[myRoomName].find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_SPAWN   } });
         
            if(mySpawns.length > 0)
            {
                mySpawn = mySpawns[0] ;
                
                if(mySpawn.recycleCreep(this) == ERR_NOT_IN_RANGE)
                {
                    this.moveTo(mySpawn);
                    
                }
                
                return 2
                
            }
            
            return -1;
        }
        
        Creep.prototype.doCharge = function(resource, myCreep)
        {
        //  console.log(myCreep.name + ' charging with ' +  resource) 
            this.chargeFromClosestContainerOrLink();
        }
        
        Creep.prototype.emptyStucture= function(targetObject)
        {
          //  console.log(' going to ' + JSON.stringify(targetObject));
            
            var x = this.transfer(targetObject, RESOURCE_ENERGY);
                        
         //   console.log('status was ' + x);
                        
            if(this.withdraw(targetObject, targetObject.mineralType) == ERR_NOT_IN_RANGE){this.moveTo(targetObject);}
                        
                return false;
        }
        
        Creep.prototype.emptyToTerm = function()
        {
           // console.log(this.name + ' empty to term');
            
            if(this.carry.energy >  0) 
            {
              //  console.log(this.name + ' carrying eneryg');
            
                targetObject = Game.rooms[Memory.myMap['P']].terminal;
                        
                var x = this.transfer(targetObject, RESOURCE_ENERGY);
                        
             //   console.log(x);
                        
                if(this.transfer(targetObject, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){this.moveTo(targetObject);}
                        
                return false;  
                        
            }
            
            var currentMineral;
            var i = 0;
            
            for(i=0; i < Memory.myMinerals.length; i++)
            {
                currentMineral = Memory.myMinerals[i];
                
              //  console.log(' checking ' + JSON.stringify(currentMineral));
                
                if(this.carry[currentMineral.mineralName] > 1)
                {
                    if(this.transfer(this.room.terminal , currentMineral.mineralName) == ERR_NOT_IN_RANGE) 
                    {
                      //  console.log('going to terminal9');
                        this.moveTo(this.room.terminal);
                        
                        return false;
                        }
                  //  return false;
                }
            }
            
            return true;
        }
        
        Creep.prototype.harvestMineral = function(resource)
        {
            var sources = this.room.find(FIND_MINERALS);
        
            if(this.harvest(sources[0]) == ERR_NOT_IN_RANGE) 
            {
                this.moveTo(sources[0]);
            }
            return;
        }
        
        Creep.prototype.getLabToUse = function(resource)
        {
            labs = this.room.find(FIND_MY_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LAB });
            for(var i = 0; i < labs.length; i++)
            {
                if(labs[i].mineralType == resource && labs[i].mineralAmount > 50)
                {
                  //   console.log('---found a lab');
                    return labs[i].id;
                }
            }
            
        
            // -9 means no labs are ready
            return -9;
        }
        

        Creep.prototype.handleBoost = function(boostType, boostLevel) 
        {
            
          //  return true;
         //   if(this.memory.homeRoom != Memory.myMap['P'])  {return true;}
        
            var resource = this.getResourceForBoost(boostType, boostLevel) ;
            
            
            if (resource == -9) 
            {
               // console.log(this.name + ' unkown resource')
                return true;
            }
            else
            {
              //  console.log(this.name + ' ' +  resource);
            }
        
            if(this.isBoosted(resource, Memory.myBoost[boostType])) {return true;}
            
            var myLab = this.getLabToUse(resource);
            if (myLab == -9) 
            {
              // console.log(this.name + ' no available lab')
                return true;
            }
            
          // console.log(this.name + ' going to boostMe ')
            this.boostMe(myLab);
            
            return false;
        }
        
        Creep.prototype.getResourceForBoost = function(boostType, boostLevel) 
        {
            var currentMineral;
            
            for(var i=0; i < Memory.myMinerals.length; i++)
            {
                currentMineral = Memory.myMinerals[i];
                
                if(currentMineral.boostType == boostType && currentMineral.boostLevel == boostLevel)
                {
                     return currentMineral.mineralName;
                }
            }
            // -9 means unknown resource
            return -9;
        }
        
        
        Creep.prototype.isBoosted = function(resource, part)
        {
            for(i=0; i < this.body.length; i++)
            {
             //   console.log(this.body[i].type + ' is boosted = ' + this.body[i].boost)
                if(this.body[i].type == part && this.body[i].boost != resource)
                {
                    return false;
                }
            }
            return true;
            
            
            
            
            
            
            
            
            /*
            
            return false;
            
        
            var resource = this.getResourceForBoost(boostType, boostLevel) ;
            var myLab = this.getLabToUse(resource);
            
            
            
            
            
            for(var i=0; i < Memory.myMinerals.length; i++)
            {
                currentMineral = Memory.myMinerals[i];
                
                if(currentMineral.boostType == boostType && currentMineral.boostLevel == boostLevel)
                {
                     resource = currentMineral.mineralName;
                     console.log('we need some ' + resource);
                     var myLab = this.getLabToUse(resource);
                     
                     if(myLab == -9)
                     {
                         // -9 means no labs are ready
                         console.log('lab not ready');
                         return true;
                     }
                     else
                     {
                         
                     }
                    
                }
            
            }
          
            console.log(' couldnt find resource ');
            return true;
            
            
         
            myLabs = this.room.find(FIND_MY_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LAB });
            
            console.log('try to boost with ' + resource);
            
            for(var i=0; i < myLabs.length; i++)
            {
                if(myLabs[i].mineralType == resource)
                {
                    return false;
                }
            }
            
            return true;
            
            
            
            if(targets[2].energy < 200)
            {
                console.log('energy in lab too low');
                return true;
            }
         
            */
            
        }
        
        Creep.prototype.boostMe = function(myLabID)
        {
            var myLab = Game.getObjectById(myLabID);
            var boostStatus = myLab.boostCreep(this);
            
            console.log('boostStatus = ' + boostStatus);
            console.log('myLab = ' + myLab.toString());
            if (boostStatus == -9)
            {
                this.moveTo(myLab);
            }
        }
        
        Creep.prototype.depositMineralsToTerm = function()
        {
           console.log(this.name + ' depositMinerals' );
            
            var currentMineral
            var i;
            for(i=0; i < Memory.myMinerals.length; i++)
            {
                currentMineral = Memory.myMinerals[i].mineralName
            //  console.log(this.name + ' depositMinerals ' + Memory.myMinerals[i].mineralName);
                
             console.log(this.name + ' ' + currentMineral + ' ' + this.carry[currentMineral] );
                
                if(this.carry[currentMineral] > 0)
                {
                 //   console.log('got here 77');
                    
                 //   var theTerminal = Game.rooms[Memory.myMap['I']].terminal;
                    
                    var theTerminal = Game.rooms[this.getToRoom()].terminal;
                    
                    
                    if(this.transfer(theTerminal , currentMineral) == ERR_NOT_IN_RANGE) 
                    {
                    //  console.log('going to terminal9');
                        this.moveTo(theTerminal);
                        return true;
                    }
                }
            }
            
            return false;
        }
        
        Creep.prototype.getFromRoom = function()
        {
           // var roomToReturn;
        
          //  console.log('got here GTR1');
            if(this.memory.mySecondLetter == 'Z') { return this.memory.homeRoom; }
            if(this.memory.mySecondLetter == 'X') { return this.pos.roomName; }
         //    console.log('got here GTR2');
            return Memory.myMap[this.memory.mySecondLetter];
        }
        
        Creep.prototype.getToRoom = function()
        {
            if(this.memory.myThirdLetter == 'Z') { return this.memory.homeRoom; }
            if(this.memory.myThirdLetter == 'X') { return this.pos.roomName; }
            
            return Memory.myMap[this.memory.myThirdLetter];
        }
        
        Creep.prototype.pickupNear = function()
        {
            var targets = this.room.find(FIND_DROPPED_RESOURCES, {filter: (i) => i.amount > 1  });
            var i
          //  console.log('my targets = ' + targets.length);
            
            for(i=0; i < targets.length; i++)
            {
              //  console.log(this.pos.getRangeTo(targets[i]));
                
                if(this.pos.getRangeTo(targets[i]) < 3)
                {
                    if(this.pickup(targets[i]) == ERR_NOT_IN_RANGE) 
                    {
                        this.moveTo(targets[i]);
                    }
 
                   return true; 
                }
            }
            
          //  return true;
            return false;
        }
        
   
        
        Creep.prototype.setAction = function()
        {
            if(this.carry.energy == 0)                   {this.memory.action = 'charge';  }
        //    if(this.carry.energy == this.carryCapacity)  {this.memory.action = 'doWork';  }
            if(this.carryCapacity == _.sum(this.carry))  {this.memory.action = 'doWork';  }
          
          //  if(this.carry.energy < this.carryCapacity)   {this.memory.action = 'charge'; return;}
            
        }
        
        Creep.prototype.goToRoomStatus = function()
        {
            //returns 1 if in correct room
            //returns 2 if in wrong room, and sends creep to correct room
    
    
            
            
            if(this.memory.action == 'charge' && this.pos.roomName == this.getFromRoom())
	        {
	           // console.log(this.name + ' correct room');
	            return 1;
	        }
	        
	       if(this.memory.action == 'doWork' && this.pos.roomName == this.getToRoom())
	        {
	          //  console.log(this.name + ' correct room');
	            return 1;
	        }
	        
	        var roomWithPower = utility.getMostPower();
	        if(this.memory.action == 'power' && this.pos.roomName == roomWithPower)
	        {
	         //  console.log(this.name + ' correct room');
	            return 1;
	        }
	        
	      //  console.log(this.name + ' wrong room ' + this.memory.action);
	        
	        if(this.memory.action == 'charge')
	        {
	            this.moveTo(new RoomPosition(25, 20, this.getFromRoom()));
	        }
	        

	        if(this.memory.action == 'doWork')
	        {
	            this.moveTo(new RoomPosition(25, 20, this.getToRoom()));
	        }
	        
	        
	        if(this.memory.action == 'power')
	        {
	            this.moveTo(new RoomPosition(25, 20, roomWithPower));
	        }
	        
	        return 2;
        }
        
        Creep.prototype.chargeFromSpawn = function()
        {
        
            var targets = this.room.find(FIND_STRUCTURES, { filter: (i) =>  (i.structureType == STRUCTURE_SPAWN && i.energy > 100 ) });
            
            if (targets.length > 0)
            {
                var closest =  this.pos.findClosestByPath(targets);
                if(this.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    this.moveTo(closest);
                }
            }
             
           console.log(this.name + 'charging from Spawn');
           return;
            
        }
        Creep.prototype.chargeFromClosestContainerOrLink = function()
        {
            try
            {
                var targets = this.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 200  ) ||   (i.structureType == STRUCTURE_LINK && i.energy > 100 )   });
                if (targets.length > 0)
                {
                    var closest =  this.pos.findClosestByPath(targets);
                    if(this.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        this.moveTo(closest, {visualizePathStyle: { fill: 'transparent', stroke: '#00FF00', lineStyle: 'dashed', strokeWidth: .05, opacity: .5}});
                    }
                }
            
                else
                {
                  //  console.log('got her 9');
                    var closest =  utility.getClosestNotEmptyContainer([Memory.myMap['K']]);
                    if(this.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        this.moveTo(closest, {visualizePathStyle: { fill: 'transparent', stroke: '#FFFF00', lineStyle: 'dashed', strokeWidth: .05, opacity: .5}});
                    }
                }
            }
            catch(err)
            {
                this.chargeFromSpawn();
                console.log('<font color=FF3333>Charge Ext catch =' + err.toString() + '</font>');
            }
            
            return;
        }
        
        Creep.prototype.chargeFromClosestContainerOrSpawn = function()
        {
            var targets = this.room.find(FIND_STRUCTURES, { filter: (i) => 
                (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 100  ) || 
                (i.structureType == STRUCTURE_SPAWN && i.energy > 100 ) 
                });
            
            if (targets.length > 0)
            {
                var closest =  this.pos.findClosestByPath(targets);
                if(this.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    this.moveTo(closest);
                    
                }
            }
            
            else
            {
            //    var closest =  utility.getClosestNotEmptyContainer(['E49N71', 'E48N71']);
             //   if(this.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {this.moveTo(closest); return;}
                
            //    creep.moveTo(new RoomPosition(13, 29, myRoomName));
            
            }
        }
        
        Creep.prototype.chargeFromTerm = function()
        {
            try
            {
                var targets = this.room.find(FIND_STRUCTURES, { filter: (i) => (i.structureType == STRUCTURE_TERMINAL && i.store[RESOURCE_ENERGY] > 100 )  });
            
                if (targets.length > 0)
                {
                    var closest =  this.pos.findClosestByPath(targets);
                    if(this.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        this.moveTo(closest, {visualizePathStyle: { fill: 'transparent', stroke: '#FF00FF', lineStyle: 'dashed', strokeWidth: .05, opacity: .5}});
                    
                    }
                    
                    return;
                }
            }
            
            catch(err)
            {
                console.log('<font color=FF3333>Charge Ext catch =' + err.toString() + '</font>');
            }
        
            this.chargeFromClosestContainerOrLink();
            
            return;
        }
        
                Creep.prototype.chargeFromClosestContainerOrLinkOrTerm = function()
        {
            try
            {
                var targets = this.room.find(FIND_STRUCTURES, { filter: (i) => 
                (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 100  ) || 
                (i.structureType == STRUCTURE_LINK && i.energy > 100 ) ||
                (i.structureType == STRUCTURE_TERMINAL && i.store[RESOURCE_ENERGY] > 100 ) 
                });
            
                if (targets.length > 0)
                {
                    var closest =  this.pos.findClosestByPath(targets);
                    if(this.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        this.moveTo(closest, {visualizePathStyle: { fill: 'transparent', stroke: '#FF00FF', lineStyle: 'dashed', strokeWidth: .05, opacity: .5}});
                    
                    }
                    
                    return;
                }
            }
            
            catch(err)
            {
                console.log('<font color=FF3333>Charge Ext catch =' + err.toString() + '</font>');
            }
        
            this.chargeFromClosestContainerOrLink();
            
            return;
        }
        
        Creep.prototype.depositToClosestExtension = function()
        {
            var targets = this.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;}});
            
            if (targets.length > 0) 
            {
                var closest =  this.pos.findClosestByPath(targets);
             
                if(this.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    this.moveTo(closest);
                }
                
                return false;
            }
            else
            {
                return true;
            }
            
        }
        
        Creep.prototype.depositToClosestSpawn = function()
        {
            var targets = this.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;}});
            
            if (targets.length > 0) 
            {
                var closest =  this.pos.findClosestByPath(targets);
             
                if(this.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    this.moveTo(closest);
                }
                
                return false;
            }
            else
            {
                return true;
            }
            
        }
        
        Creep.prototype.depositToClosestLinkOrContainer = function()
        {
            var targets = this.room.find(FIND_STRUCTURES, { filter: (i) =>
                (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] < i.storeCapacity ) ||
                (i.structureType == STRUCTURE_LINK && i.energy < i.energyCapacity ) ||
                (i.structureType == STRUCTURE_SPAWN && i.energy < i.energyCapacity )
            });
                
          //   console.log('-------- targets.length = '  + targets.length);
            
            if (targets.length > 0) 
            {
                var closest =  this.pos.findClosestByPath(targets);
             
                if(this.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    this.moveTo(closest);
                }
            }
        }
        
        Creep.prototype.depositToClosestContainer = function(resource)
        {
            var targets = this.room.find(FIND_STRUCTURES, { filter: (i) =>
                (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] < i.storeCapacity )  
            });
                
          //  console.log('-------- targets.length = '  + targets.length);
            
            if (targets.length > 0) 
            {
                var closest =  this.pos.findClosestByPath(targets);
             
                if(this.transfer(closest, resource) == ERR_NOT_IN_RANGE) 
                {
                    this.moveTo(closest);
                }
            }
        }
       
        Creep.prototype.upgradeCont = function()
        {
            if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) 
	        {
                this.moveTo(this.room.controller);
            }
        }
       
        Creep.prototype.getRepairJob = function() 
	    {
	      //  console.log('in get job');
	      //  console.log(Memory.repairRoomJobs[creepPos.roomName][0]);
	        
	        return Memory.repairRoomJobs[this.getToRoom()][0];
        
    	} 
    	
    	Creep.prototype.getRepairJobOtherRoom = function() 
	    {
	         console.log('in get job other room');
	         
	         for(var key in Memory.repairRoomJobs)
	         {
                 
          
                if(Memory.repairRoomJobs[key].length > 0)
                {
                    console.log(key + " -> " + Memory.repairRoomJobs[key]) ; 
                    return Memory.repairRoomJobs[key][0]; 
                }
            }
	         
	         
	         
    	   console.log('ALL ZERO');
	        
	    //    return Memory.repairRoomJobs[this.getToRoom()][0];
        
    	} 
       
    },

   
    
    
    
    
    
    
    
    
    
    
    
    
    hello: function()
    {
       // console.log('hello world');    
    }
}
module.exports = utilityBase;