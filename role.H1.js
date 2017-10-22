var utility = require('utility');

var harvestFrom ;
var depositTo ;

var H1 = 
{
    run: function(creep)
    {
        try
        {
            
          //  console.log('got here I1');
            var sources = creep.room.find(FIND_SOURCES);

            if (sources[1].energy == 0)
            {
                console.log(' become an E?')
              //  console.log(' harvetStatus =' + harvetStatus)
                        
                creep.E();
                return;
            }
                    
                    
                    
            if(creep.handleBoost('harvest', 1))
            {
             //   console.log(creep.name + 'boost handled, continue');
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
                    var harvetStatus = creep.harvestEnergy(1);
                }
                return;
            }
            
            if(creep.memory.action == 'doWork')
            {
               // console.log(creep.name + ' do work')
               creep.depositToClosestLinkOrContainer();
              //  creep.depositToClosestSpawn();
                return;
            }
        } 
            
        catch(err)
        {
            console.log('<font color=FF3333>H1 ' + err.toString() + '</font>');
        }
    }
};

module.exports = H1;