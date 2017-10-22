var utility = require('utility');

var targetObject;
var currentTarget;
 
var W = {
    run: function(creep) 
    {
        try
        {
            console.log(creep.name + ' got into W');
            
            
            
            if(creep.carryCapacity == _.sum(creep.carry))  
            {
                console.log(creep.name + ' is full, will try to deposit');
               
                creep.memory.action = 'doWork'
                if(creep.goToRoomStatus() == 2) { return; }
                creep.depositToClosestLinkOrContainer();  
                
            }
            else
            {
                console.log(creep.name + ' time to wreck');
                
                
                creep.memory.action = 'charge'
                if(creep.goToRoomStatus() == 2) { return; }
                
           //     targetObject =  Game.getObjectById(myJob.structureID);
                targets = creep.room.find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_WALL } })
                targetObject = targets[0];
                
                console.log(creep.name + ' ' +  targetObject.toLocaleString() + ' ' +  targetObject.pos.toLocaleString());
                
                if(creep.dismantle(targetObject) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targetObject, {visualizePathStyle: { fill: 'transparent', stroke: '#00FFFF', lineStyle: 'dashed', strokeWidth: .05, opacity: .5}});
                    
                    
                }
                 
                
            }
             
             /*
             
        
            if(creep.carry.energy == 0) 
            {
                creep.doCharge(RESOURCE_ENERGY, creep);
                return;
            }
        
         
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
            
            */
            
        }
        
        
        
        
        catch(err)
        {
            console.log(creep.name +  ' err in W = ' + err.toLocaleString());
        }

	}
	
};

module.exports = W;