var utility = require('utility');


var UC = {

    main: function(myRoomName)
    {
     // console.log('in main construct');  
    //  console.log(this.b);  
      
      this.putRampAroundSpawn(myRoomName);
   //  this.putWallsNearExit(myRoomName);
    },
    
    
    
    putRampAroundSpawn: function(myRoomName)
    {
        if(Game.rooms[myRoomName].controller.level < 3) {  return; }
        
        var mySpawns = Game.rooms[myRoomName].find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_SPAWN   } });
        var theSpawn;
        var x;
        var y;
        
        for(var i = 0; i < mySpawns.length; i++)
        {
            theSpawn = mySpawns[i];
            
            console.log(theSpawn.pos)
            
            x = theSpawn.pos.x;
            y = theSpawn.pos.y;
            
            
            this.buildRampart(myRoomName, x - 1, y - 1);  this.buildRampart(myRoomName, x, y - 1);    this.buildRampart(myRoomName, x + 1, y - 1);
            
            this.buildWall(myRoomName, x - 1, y);                                                    this.buildWall(myRoomName, x + 1, y);
            
            this.buildWall(myRoomName, x - 1, y + 1);      this.buildWall(myRoomName, x, y + 1);     this.buildWall(myRoomName, x + 1, y + 1);
            
        }
    },
    
    
    putWallsNearExit: function(myRoomName)
    {
       this.leftWalls(myRoomName);
       this.topWalls(myRoomName);
       this.rightWalls(myRoomName);
       this.bottomWalls(myRoomName);
        
    //    this.isWallThere(myRoomName, 49, 42);
     //   this.isWallThere(myRoomName, 49, 38);
    },
    
    leftWalls: function(myRoomName)
    {
        x = 0;
        y = 0;
        
        for(y=0; y < 50; y++)
        {
            if(this.isWallThere(myRoomName, x, y))
            {
                
            }
            else
            {
              //  console.log(y);
                
                this.buildWall(myRoomName, x, y);
                this.buildWall(myRoomName, x + 2, y);
                this.buildWall(myRoomName, x + 2, y + 2);
                this.buildWall(myRoomName, x + 2, y - 2);
                this.buildWall(myRoomName, x + 1, y + 2);
                this.buildWall(myRoomName, x + 1, y - 2);
              
            }
        }
    },
    
    rightWalls: function(myRoomName)
    {
        x = 49;
        y = 0;
        
        for(y=0; y < 50; y++)
        {
            if(this.isWallThere(myRoomName, x, y))
            {
                
            }
            else
            {
              //  console.log(y);
                
                this.buildWall(myRoomName, x, y);
                this.buildWall(myRoomName, x - 2, y);
                this.buildWall(myRoomName, x - 2, y + 2);
                this.buildWall(myRoomName, x - 2, y - 2);
                this.buildWall(myRoomName, x - 1, y + 2);
                this.buildWall(myRoomName, x - 1, y - 2);
              
            }
        }
    },
    
    topWalls: function(myRoomName)
    {
        x = 0;
        y = 0;
        
        for(x=0; x < 50; x++)
        {
            if(this.isWallThere(myRoomName, x, y))
            {
                
            }
            else
            {
              //  console.log(y);
                
            //    this.buildWall(myRoomName, x, y);
             //   this.buildWall(myRoomName, x, y + 2);
                this.buildWall(myRoomName, x + 2, y + 2);
                this.buildWall(myRoomName, x - 2, y + 2);
                this.buildWall(myRoomName, x + 2, y + 1);
                this.buildWall(myRoomName, x - 2, y + 1);
              
            }
        }
    },
    
    bottomWalls: function(myRoomName)
    {
        x = 0;
        y = 49;
        
        for(x=0; x < 50; x++)
        {
            if(this.isWallThere(myRoomName, x, y))
            {
                
            }
            else
            {
              //  console.log(y);
                
            //    this.buildWall(myRoomName, x, y);
             //   this.buildWall(myRoomName, x, y + 2);
                this.buildWall(myRoomName, x + 2, y - 2);
                this.buildWall(myRoomName, x - 2, y - 2);
                this.buildWall(myRoomName, x + 2, y - 1);
                this.buildWall(myRoomName, x - 2, y - 1);
              
            }
        }
    },
    
    
    
    buildRampart: function(myRoomName, x, y)
    {
        if(this.isStructureThere(myRoomName, x, y))
        {
            
        }
        else
        {
            Game.rooms[myRoomName].createConstructionSite(x, y, STRUCTURE_RAMPART);
        }
    },
    
    
    buildWall: function(myRoomName, x, y)
    {
       // console.log(x + ', ' + y);
        
        try
        {
            if(this.isStructureThere(myRoomName, x, y) ||  this.isWallThere(myRoomName, x, y))
            {
            //    console.log('got here 2');
            }
            else
            {
             //   console.log('got here 1');
                Game.rooms[myRoomName].createConstructionSite(x, y, STRUCTURE_WALL);
            }
        }
        catch(err)
        {
      //      console.log(err.toString());
        }
    },
    
    isWallThere: function(myRoomName, x, y)
    {
        if(Game.rooms[myRoomName].lookForAt('terrain', x, y) == 'wall')
        {
            return true;
        }
    },
    
    
    isStructureThere: function(myRoomName, x, y)
    {
        var valueToReturn = false;
        var myLook = Game.rooms[myRoomName].lookAt(x, y);
        
        myLook.forEach(
            function(lookObject) 
            {
                if(lookObject.type == LOOK_STRUCTURES) 
                {
                   valueToReturn = true;
                }
            }
        );
        
        
     //   console.log('about to return ' + valueToReturn);
        return valueToReturn;
    },
    
    
    
    getOwner: function(roomToCheck)
    {
        try
        {
            return  myOwner = roomToCheck.controller.owner.username;
        }
        catch(err)
        {
          //  console.log(err.toString());
            return null;
            
        }
    },
    
    
    
    
    
    
    get b() { return 7 + 1; },
    
    
  
    
    getJobByDroneName: function(creepName)
    {
      	
      	jobsArray = Memory.jobs;
	    
	    var i;
	    for(i=0; i < jobsArray.length; i++)
	    {
	        currentJob = jobsArray[i];
	        if(currentJob.droneName == creepName) {return currentJob;}
	    }  
	    
      return null;  
    }, 
    
  
    
 
    
    isOnInterval: function(interval)
    {
      //  return true;
        
        if(Game.time % interval == 0) {return true;}
        return false;
    },
    
    
    
    
    
    
    hello: function()
    {
         console.log('hello world');    
    }
}
module.exports = UC;