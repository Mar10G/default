var utility = require('utility');

var depositTo;

var roleOxygen = 
{
    run: function(creep)
    {
        try
        {
            if(creep.handleBoost('harvest', 3))
            {
             // console.log(creep.name + 'boost handled, continue');
            }
            else
            {
             //   console.log(creep.name + 'boost NOT handled, STOP');
                return;
            }
            
            creep.setAction();
            
            if(creep.goToRoomStatus() == 2) // checking for in wrong room
            {
                return;
            }
            
            if(creep.memory.action == 'charge')
            {
               // console.log(creep.name + ' charge')
                creep.harvestMineral(RESOURCE_OXYGEN);
                return;
            }
            
            if(creep.memory.action == 'doWork')
            {
              //  console.log(creep.name + ' do work')
            //    creep.depositToClosestContainer(RESOURCE_OXYGEN);
            creep.depositMineralsToTerm();
                return;
            }
            
        }
        catch(err)
        {
            console.log('<font color=FF3333>Oxygen catch = ' + err.toString() + '</font>');
        }
    }
};

module.exports = roleOxygen;

/*
            
        var harvestFrom = Memory.myMap[creep.memory.mySecondLetter];
        var depositTo = Memory.myMap[creep.memory.myThirdLetter];
        
      //  console.log(creep.name + ' from ' + harvestFrom);
      //  console.log(creep.name + ' to ' + depositTo);
        
        if(creep.carry.energy == 0)                   {creep.memory.action = 'harvest';}
        if(creep.carryCapacity == _.sum(creep.carry) )  {creep.memory.action = 'deposit';}
        
        if(creep.memory.action == 'harvest')
        {
          //  console.log(creep.name + ' harvest from ' + harvestFrom);
            
            if(creep.room.name != harvestFrom)
            {
                creep.moveTo(new RoomPosition(25, 25, harvestFrom));
                return;
            }
            else
            {
                var sources = creep.room.find(FIND_MINERALS);
                
            //    console.log(creep.name + ' ' +  sources.length);
                
                
             
                    mySource = 0;
                    
                
                
                if(sources[mySource].energy == 0)  {mySource = 0;}
                
                if(creep.harvest(sources[mySource]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(sources[mySource]);
                }
                return;
            }
            
            console.log('REALLY SHOULD NOT GET HERE');
        }
        
        if(creep.memory.action == 'deposit')
        {
          //  console.log(creep.name + ' deposit to ' + depositTo);
            
            
            if(creep.room.name != depositTo )
                {
                    creep.moveTo(new RoomPosition(25, 25, depositTo));
                    return;
                }
                else
                {
                    var targets = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] < i.storeCapacity });
            
                 //  console.log(creep.name + ' targets ' + targets.length)
            
                    if(targets.length > 0) 
                    {
                        var closest =  creep.pos.findClosestByPath(targets);
                        
                      //  console.log('closest ' + closest);
                
                        if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                        {
                            creep.moveTo(closest);
                            return;
                        }
                        else
                        {
                            for(var resourceType in creep.carry) 
                            {
	                            creep.transfer(closest, resourceType);
                            }
                        }
                        
                        return;
                    }
                    return;
                }
                
            console.log('got here an probably should not ' + creep.name + ' ' + creep.memory.action);
        }
	}
};
*/

