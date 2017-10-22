var E = 
{
    run: function(creep)
    {
        try
        {
            
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
                creep.chargeFromClosestContainerOrLink();
                return;
            }
            
            if(creep.memory.action == 'doWork')
            {
                var extensionsFull = creep.depositToClosestExtension();
             //   console.log('extensionFull = ' + extensionsFull );
                
                if (extensionsFull)
                {
                    var spawnsFull = creep.depositToClosestSpawn();
              //      console.log('spawnsFull = ' + spawnsFull );
                }
   
                return;
            }
            
        } 
            
        catch(err)
        {
            console.log('<font color=FF3333>Charge Ext catch =' + err.toString() + '</font>');
        }
    }
    
};
        

module.exports = E;