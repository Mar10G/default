var utility = require('utility');

var targetObject;
var toRoom;
var currentTarget;
var possibleTarget;
 
var R = {
    run: function(creep) 
    {
        try
        {
         //   console.log('got here R1 ' + creep.name);
         
            for(var i=0; i < Memory.myMinerals.length; i++)
            {
                currentMineral = Memory.myMinerals[i];
             
                if(creep.carry[currentMineral.mineralName] > 1)
                {
                    console.log(currentMineral.mineralName);
                    
                    if(creep.transfer(creep.room.terminal , currentMineral.mineralName) == ERR_NOT_IN_RANGE) 
                    {
                         //   console.log('going to terminal9');
                        creep.moveTo(creep.room.terminal);
                        return;
                    }
                }
            }
         
         
         
        
        
            
            if(this.doPickups(creep) == 1)
            {
                console.log(creep.name + " should be pickup");
                return;
            }
            
            if(creep.carry.energy == 0) 
            {
                console.log(creep.name +  ' charging' );
                creep.doCharge(RESOURCE_ENERGY, creep);
                return;
            }
            
            toRoom = creep.getToRoom(); 
            
           
            
           // console.log(creep.memory.maxHits + '  -  ' + creep.memory.structureID);
            
            if(creep.memory.structureID == null)
            {
              //  console.log(creep.name + ' look for broken') ;  
                this.lookFor(creep);
                return;
            }
            
            else
            {
              //  console.log(creep.name + ' go fix it') ;  
                this.goFixIt(creep);
                return;
            }
            
            

            
            return;
            
           
            
            currentTarget = null;
            
           
            targets = Game.rooms[toRoom].find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_ROAD && object.hits < (object.hitsMax * .65) ;} });
            console.log( targets.length + ' road targets for ' + creep.name);
          
            if(targets.length > 0)
            {
                this.setMemory(creep, targets[0], targets[0].hitsMax);
            }
          
          
          
          //  console.log(creep.getToRoom());
            for(i=0; i < targets.length; i++)
            {
                item = targets[i];
                possibleTarget = new this.toRepair(item, item.hitsMax);
                
                if(currentTarget == null)
                {
                    currentTarget =  possibleTarget;
                    console.log( parseFloat(currentTarget.percent * 100).toFixed(2) +  '% ' + currentTarget.structureType );
                }
                
                if(possibleTarget.percent < currentTarget.percent)
                {
                    currentTarget =  possibleTarget;
                    console.log( parseFloat(currentTarget.percent * 100).toFixed(2) +  '% ' + currentTarget.structureType );
                }
                
            }
            
            var highTresh = utility.getLowThreshold(Game.rooms[toRoom]) * 3;
          //  console.log('high thresh = ' + highTresh)
            targets = Game.rooms[toRoom].find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_WALL && object.hits < (highTresh * 1.0) ;} });
         
          //  console.log(targets.length + ' wall targets for ' + creep.name);
            
            for(i=0; i < targets.length; i++)
            {
                item = targets[i];
                possibleTarget = new this.toRepair(item, highTresh);
                
                if(currentTarget == null)
                {
                    currentTarget =  possibleTarget;
                    console.log( parseFloat(currentTarget.percent * 100).toFixed(2) +  '% ' + currentTarget.structureType );
                }
                
                if(possibleTarget.percent < currentTarget.percent)
                {
                    currentTarget =  possibleTarget;
                    console.log( parseFloat(currentTarget.percent * 100).toFixed(2) +  '% ' + currentTarget.structureType );
                }
                
            }
            
            
            
            targetObject =  Game.getObjectById(currentTarget.structureID);
        
            if(creep.repair(targetObject) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(targetObject, {visualizePathStyle: { fill: 'transparent', stroke: '#FF0000', lineStyle: 'dashed', strokeWidth: .05, opacity: .5}});
                
            }
          
          
          
            return;
        
        //console.log('Repaired ' + parseFloat(percent * 100).toFixed(2) + '% - ' + objectHealth + ' of ' + desiredHealth + ' ' + targetObject.structureType);
        
         
            if(Memory.repairRoomJobs[creep.getToRoom()].length == 0)
            {
                myJob = creep.getRepairJobOtherRoom();  
            }
            else
            {
                myJob = creep.getRepairJob();  
            }
        
        
            targetObject =  Game.getObjectById(myJob.structureID);
             
            if(creep.repair(targetObject) == ERR_NOT_IN_RANGE){creep.moveTo(targetObject);}
        }
        
        catch(err)
        {
            console.log('err = ' + err.toLocaleString());
        }

	},
	
	goFixIt: function(creep)
	{
	 //   console.log("gonna fix it");  
	    
	    targetObject =  Game.getObjectById(creep.memory.structureID);
        
        if(creep.repair(targetObject) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(targetObject, {visualizePathStyle: { fill: 'transparent', stroke: '#FF0000', lineStyle: 'dashed', strokeWidth: .05, opacity: .5}});
                
        }
        
        percent = targetObject.hits / creep.memory.maxHits;
        console.log(parseFloat(percent * 100).toFixed(2) +  '% ' + targetObject.structureType );
        
        if(targetObject.hits >= creep.memory.maxHits)
        {
            creep.memory.structureID = null;
        }
	},
 
    lookFor: function(creep)
    {
        
        /////Ramparts
        var highTresh = utility.getLowThreshold(Game.rooms[toRoom]) * 3;
      //  console.log('high thresh = ' + highTresh)
        targets = Game.rooms[toRoom].find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_RAMPART && object.hits < (highTresh * .9) ;} });
      //  console.log(targets.length + ' rampart targets for ' + creep.name);
        
        if(targets.length > 0)
        {
            this.setMemory(creep, targets[0], highTresh);
            return;
        }
        
        
        
        /////Roads
        targets = Game.rooms[toRoom].find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_ROAD && object.hits < (object.hitsMax * .8) ;} });
     //   console.log( targets.length + ' road targets for ' + creep.name);
          
        if(targets.length > 0)
        {
            this.setMemory(creep, targets[0], targets[0].hitsMax);
            return;
        }
        
        
        /////Containers
        targets = Game.rooms[toRoom].find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_CONTAINER && object.hits < (object.hitsMax * .8) ;} });
     //   console.log( targets.length + ' container targets for ' + creep.name);
          
        if(targets.length > 0)
        {
            this.setMemory(creep, targets[0], targets[0].hitsMax);
            return;
        }
        
        
        /////Walls
        var highTresh = utility.getLowThreshold(Game.rooms[toRoom]) * 3;
      //  console.log('high thresh = ' + highTresh)
        targets = Game.rooms[toRoom].find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_WALL && object.hits < (highTresh * .9) ;} });
      //  console.log(targets.length + ' wall targets for ' + creep.name);
        
        if(targets.length > 0)
        {
            this.setMemory(creep, targets[0], highTresh);
            return;
        }
        
        
        
        
    },
 
 
    doPickups: function(creep)
    {
        toRoom = creep.getToRoom(); 
        targets = Game.rooms[toRoom].find(FIND_DROPPED_RESOURCES, {filter: (i) => i.amount > 20 });
      //  console.log(creep.name + ' targets = ' + targets.length)
        
        if (targets.length > 0)
        {
            console.log('targets = ' + targets.length)
            targetObject = targets[0];
            
            if(creep.carry.energy >  0) 
            {
                creep.depositToClosestLinkOrContainer();
                return 1;
            }
                   
            if(creep.pickup(targetObject) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(targetObject, {visualizePathStyle: { fill: 'transparent', stroke: '#0000FF', lineStyle: 'dashed', strokeWidth: .05, opacity: .5}});
                return 1;
                        
            }
            return 1;
                    
        }
        else
        {
            return 2;
        }
            
              
    },
 
    setMemory: function(myCreep, myStructure, maxHits)
    { 
        myCreep.memory.structureID = myStructure.id;
        myCreep.memory.maxHits = maxHits;
        
        //console.log(creep.memory.structureID + '  -  ' + creep.memory.structureID);
    },
	
	toRepair: class 
    {
        constructor(myStructure, maxHits) 
        {
            this.structureID = myStructure.id;
            this.gameTime = Game.time;
            this.isBeingWorked = false;
            this.guid =  this.newGuid();
            this.myLocation = myStructure.pos;
            this.hits = myStructure.hits;
            this.hitsMax = maxHits;
            this.structureType = myStructure.structureType;
            this.percent = myStructure.hits / maxHits ;
        } 
    
        S4() {return (((1+Math.random())*0x10000)|0).toString(16).substring(1); }
        
        newGuid() {return (this.S4() + this.S4() + "-" + this.S4() + "-4" +this. S4().substr(0,3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();}
    }
	
};

module.exports = R;