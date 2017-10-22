var utility = require('utility');

var harvestFrom ;
var depositTo ;

var H0 = 
{
    run: function(creep)
    {
        try
        {
          //  console.log('got here H1');
            
            /*
            if(!(creep.isBoosted('harvest', 1)))
            {
            //    console.log('trying to boost ' + creep.name);
                creep.boostMe('harvest');
                return;
            }
            */
            
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
            
            
        
            creep.setAction();
            
            if(creep.goToRoomStatus() == 2) // checking for in wrong room
            {
                return;
            }
            
            if(creep.memory.action == 'charge')
            {
               // console.log(creep.name + ' charge')
               
                var pickupStatus = creep.pickupNear();
             //   console.log(creep.name + ' pickup ' + pickupStatus)
                
                
                
                if(!pickupStatus)
                {
                    var sources = creep.room.find(FIND_SOURCES);
                    
                 // console.log('energy in zero = ' + sources[0].energy  )
                    
                    if(sources[0].energy > 0)
                    {
                        creep.harvestEnergy(0);
                    }
                    else
                    {
                       // creep.harvestEnergy(1);
                    }
                }
                return;
            }
            
            if(creep.memory.action == 'doWork')
            {
            // console.log(creep.name + ' do work')
                 creep.depositToClosestLinkOrContainer();
               // creep.depositToClosestSpawn();
                return;
            }
        } 
            
        catch(err)
        {
            console.log(creep.name + '<font color=FF3333>H0 ' + err.toString() + '</font>');
        }
    }
};

module.exports = H0 ;