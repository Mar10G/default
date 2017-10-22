var utility = require('utility');
var chargeFrom ;
var attackTo;
var depositTo;

var roleAttack = 
{
    run: function(creep)
    {
        creep.memory.action = 'attack';
        console.log('Memory.roomsAtWar.lengt ' + Memory.roomsAtWar.length);
        
        if(Memory.roomsAtWar.length > 0)
        {
            console.log(creep.name + ' got here 123');
            attackTo = Memory.roomsAtWar[0];
        }
        else
        {
           // return;
            
            
            console.log(creep.name + ' got here ABC');
            attackTo = Memory.myMap[creep.memory.myThirdLetter];
          //  attackTo = Memory.myMap['K'];
            
            if(creep.recycleMe() == 2)
            {
                return;
            }
        }
        
        
        //chargeFrom = Memory.myMap[creep.memory.mySecondLetter];
    
        
      //  console.log(creep.name + ' charge ' + chargeFrom);
    //    console.log(creep.name + ' attack ' + attackTo);
        
      //  if(creep.carry.energy == 0)                   {creep.memory.action = 'charge';}
       // if(creep.carry.energy == creep.carryCapacity) {creep.memory.action = 'attack';}
        
        if(creep.memory.action == 'charge') {this.doCharge(creep);}
        if(creep.memory.action == 'attack') {this.doAttack(creep);}
        
    },
    
    doCharge: function(creep)
    {
        console.log(creep.name + 'do charge');
        
    },
    
    doAttack: function(creep)
    {
        
        console.log(creep.name + ' do attack ' + attackTo);
        
        if(creep.room.name != attackTo)
        {
            creep.moveTo(new RoomPosition(25, 25, attackTo));
            return;
        }
        else
        {
            var hostiles = Game.rooms[attackTo].find(FIND_HOSTILE_CREEPS);
    
            if(hostiles.length > 0) 
            {
                var username = hostiles[0].owner.username;
                Game.notify(`User ${username} spotted in room ${attackTo}`);
        
        
                if(creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(hostiles[0]);
                    return;
                }
            }
            else
            {
                creep.moveTo(new RoomPosition(25, 20, attackTo)); 
                return;
            }
                
            return;
        }
    }
    
    /*
    
        
        if(creep.memory.action == 'charge')
        {
          var targets = creep.room.find(FIND_STRUCTURES, { filter: (i) => 
                (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0  ) || 
                (i.structureType == STRUCTURE_LINK && i.energy > 0 ) 
                
            });
            
            if (targets.length > 0)
            {
                var closest =  creep.pos.findClosestByPath(targets);
                if(creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {creep.moveTo(closest);}
            }
            else
            {
             //   console.log('wrong room');
	            creep.moveTo(new RoomPosition(25, 20, 'E49N71'));
	            return;
            }
            
            return; 
            
        }
        
         if(creep.memory.action == 'attack')
        {
            if(creep.room.name != depositTo)
            {
                creep.moveTo(new RoomPosition(25, 25, depositTo));
                return;
            }
            else
            {
                var hostiles = Game.rooms[depositTo].find(FIND_HOSTILE_CREEPS);
    
                if(hostiles.length > 0) 
                {
                    var username = hostiles[0].owner.username;
                    Game.notify(`User ${username} spotted in room ${depositTo}`);
        
        
                     if(creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(hostiles[0]);
                        return;
                    }
                    return;
        
        //var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        
        //towers.forEach(tower => tower.attack(hostiles[0]));
                }
                
                else
                {
                    creep.moveTo(new RoomPosition(25, 25, depositTo));
                return;
                }
            }
            
            
            
            var closest =  utility.getClosestNotFullEnergyHolder(creep.memory.workRooms, creep.pos);
                
            if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(closest);
                return;
            }
            
        }
        
        
        if(creep.memory.action == 'deposit')
        {
           // utility.hello();
         //  console.log(creep.name);
            
            var closest =  utility.getClosestNotFullEnergyHolder(creep.memory.workRooms, creep.pos);
                
            if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(closest);
                return;
            }
            
            console.log('got here an probably should not');
            
            var i
            
            for(i = 0; i < creep.memory.workRooms.length; i++ )
            {
                depositTo = creep.memory.workRooms[i];
                
              depositTo = 'E48N71';
                
                if(creep.room.name != depositTo )
                {
                    creep.moveTo(new RoomPosition(25, 25, depositTo));
                    return;
                }
                else
                {
                    var targets = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] < i.storeCapacity });
            
                    if(targets.length > 0) 
                    {
                        var closest =  creep.pos.findClosestByPath(targets);
                
                        if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                        {
                            creep.moveTo(closest);
                            return;
                        }
                    }
                }
            }
        }
        
      */  
        /*
        
        if(creep.memory.action == 'deposit')
        {
            if(creep.room.name != depositTo )
            {
                creep.moveTo(new RoomPosition(25, 25, depositTo ));
                return;
            }
           else
           {
                var targets = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] < i.storeCapacity });
            
                if(targets.length > 0) 
                {
                    var closest =  creep.pos.findClosestByPath(targets);
                
                    if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(closest);
                        return;
                    }
                }
            }
        }
        
        */
        
	    /*
	    if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }
        else
        {
            var targets = creep.room.find(FIND_STRUCTURES, { filter: (i) => i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] < i.storeCapacity });
            if(targets.length > 0) 
            {
                var closest =  creep.pos.findClosestByPath(targets);
                
                if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(closest);
                    return;
                }
            }
        }
        
        */
	
};

module.exports = roleAttack;