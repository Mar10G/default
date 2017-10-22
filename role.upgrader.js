var myRoomName;
var targets;


var roleUpgrader = {

     run: function(creep)
    {
        try
        {
         //   creep.memory.action = 'charge';
            
            
            if(creep.handleBoost('upgradeController', 3))
            {
              //  console.log(creep.name + 'boost handled, continue');
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
              //  console.log(creep.name + ' charge')
             //   creep.chargeFromClosestContainerOrSpawn();
             //   creep.doCharge(RESOURCE_ENERGY, creep);
               // creep.doCharge();
               
            //   creep.chargeFromClosestContainerOrLinkOrTerm();
               creep.chargeFromClosestContainerOrLink();
                return;
            }
            
            if(creep.memory.action == 'doWork')
            {
            //  console.log(creep.name + ' do work')
                creep.upgradeCont();
                return;
            }
            
        } 
            
        catch(err)
        {
            console.log('<font color=FF3333>' + err.toString() + '</font>');
        }
    }
}

  
  

module.exports = roleUpgrader;