var utility = require('utility');

var harvestFrom ;
var depositTo ;

var P = 
{
    run: function(creep)
    {
        try
        {
            creep.memory.action = 'power'
            if(creep.goToRoomStatus() == 2) { return; }
            
          //  var roomWithPower = utility.getMostPower();
            
         //   console.log(creep.name + ' most power = ' + roomWithPower);
           
           
         //   var wounded = Game.rooms[creep.pos.roomName].find(FIND_MY_CREEPS, {filter: function(object) {return ( object.hits < object.hitsMax );} } );   
        //    console.log(creep.name + ' found wounded ' + wounded.length);
                
         //   if(wounded.length > 0) 
         //   {
         //       if(creep.heal(wounded[0]) == ERR_NOT_IN_RANGE){creep.moveTo(wounded[0]);}
         //   }
           
            
                var sources = creep.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_POWER_BANK });
            //    console.log(creep.name + ' sources = ' +  sources.length);
                
                if(creep.attack(sources[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(sources[0]);
                    return;
                }
                return;
            
            
            
                
            return;
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
          //  console.log('got here sdfsdf');
            /*
            if(!(creep.isBoosted('harvest', 1)))
            {
            //    console.log('trying to boost ' + creep.name);
                creep.boostMe('harvest');
                return;
            }
            
            
            if(creep.handleBoost('harvest', 1))
            {
             //   console.log(creep.name + 'boost handled, continue');
            }
            else
            {
             //   console.log(creep.name + 'boost NOT handled, STOP');
                return;
            }
            
            if(creep.handleBoost('capacity', 1))
            {
              //  console.log(creep.name + 'boost handled, continue');
            }
            else
            {
              //  console.log(creep.name + 'boost NOT handled, STOP');
                return;
            }
            
            
            */
            
            console.log(creep.name + ' POWER=' + creep.carry[RESOURCE_POWER]);
        
            creep.setAction();
            
            if(creep.goToRoomStatus() == 2) // checking for in wrong room
            {
                return;
            }
            
            
            
            if(creep.carry[RESOURCE_POWER] == undefined)
            {
                console.log(creep.name +  ' NO POWER ');
                
                
                var sources = creep.room.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_POWER_BANK });
                
               console.log(creep.name + ' sources = ' +  sources.length);
                
                
                var x = creep.attack(sources[0]);
                
                console.log ('status = ' +  x);
             
               if(creep.attack(sources[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(sources[0]);
                    return;
                }
                
                
                
            }
            else
            {
                console.log(creep.name +  ' SOME POWER ');
                
                creep.emptyToTerm();
            }
            
            
            return;
            
            
            
            
            
            
            
            
            
            
            
            if(creep.memory.action == 'charge')
            {
               // console.log(creep.name + ' charge')
               
                var pickupStatus = creep.pickupNear();
             //   console.log(creep.name + ' pickup ' + pickupStatus)
                
                if(!pickupStatus)
                {
                 //   creep.harvestEnergy(0);
                }
                return;
            }
            
            if(creep.memory.action == 'doWork')
            {
            //    console.log(creep.name + ' do work')
              //  creep.depositToClosestLinkOrContainer();
                return;
            }
        } 
            
        catch(err)
        {
            console.log(creep.name + '<font color=FF3333>P ' + err.toString() + '</font>');
        }
    }
};

module.exports = P ;