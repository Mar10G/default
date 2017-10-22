var roleClaimy = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        var myRoomName = Memory.myMap[creep.memory.myThirdLetter] ;
        
        if(creep.pos.roomName == myRoomName)
	    {
	        //   console.log('correct room');
	           
	           var claimAttempt = creep.claimController(creep.room.controller);
	           
	            console.log('claimAttempt = ' + claimAttempt  )
	           
	           if (claimAttempt == 0)
	           {
	               Game.notify(myRoomName + ' claimed !!!!!!!!');
	               creep.room.controller.activateSafeMode;
	               return;
	           }
	           
	           if (claimAttempt == -7)
	           {
	               creep.signController(creep.room.controller, this.getQuote());
	               console.log('invalid controller');
	               return;
	           }
	           
	           if (claimAttempt == -9)
	           {
	               console.log('too far away');
	               creep.moveTo(creep.room.controller);
                   return;
	           }
	           
	           
	           if (claimAttempt == -15)
	           {
	            //    console.log('GCL too low');
	               
	               var reserveAttempt = creep.reserveController(creep.room.controller);
	              
	               console.log(reserveAttempt);
	               
	               if(reserveAttempt== ERR_NOT_IN_RANGE)
	               {
	                  creep.moveTo(creep.room.controller); 
	               }
	               creep.signController(creep.room.controller, this.getQuote());
	               
                   return;
	           }
	
	    }
	    else
	    {
	        creep.moveTo(new RoomPosition(25, 20, myRoomName));
	        return;
	   }
    },
    
    getQuote: function()
    {
        
        var quoteArray = [
                'Oh man, Rick! What is this place?',
                'Break the cycle, Morty. Rise above. Focus on science', 
                'Why would a Pop-Tart want to live inside a toaster, Rick? I mean, that would be like the scariest place for them to live',
                'Grandpa Rick! Can you help me with my science homework?',
                'Im Mr. Meeseeks! Look at me!',
                'Morty, do you know what "wubba lubba dub dub" means?'
                ];
                
        return _.sample(quoteArray);
    }
}

module.exports = roleClaimy;