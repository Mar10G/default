var utility = require('utility');
var utilityMemory = require('utility.memory');

var creepBuilders = [];
var myEnergy;
var myEnergyCap;
 
var utilitySpawn = 
{
    main: function(myRoomName) 
    {
     //   console.log(utility.getRoomEnergyStatus(myRoomName));
     
        var myScreeps = Game.rooms[myRoomName].find(FIND_MY_CREEPS);     
        if(myScreeps.length < 2)    
        { 
            this.makeCreep(300, 'K', 'Z', 'Z', myRoomName);  
            return;
        }
        
         
        
        
        var sources = Game.rooms[myRoomName].find(FIND_SOURCES);
        
        creepBuilders = [];
        
        /////Charge Extensions
        creepBuilders.push(new this.creepBuilder('E', 'X', 'Z', 2, 1));
        
        /////Defense
        creepBuilders.push(new this.creepBuilder('A', 'X', 'X', 0, 2));
        creepBuilders.push(new this.creepBuilder('B', 'X', 'X', 0, 2));
        
        /////Harvest
       
       creepBuilders.push(new this.creepBuilder('H', 'Z', 'Z', 2, 1)); 
       
            if(sources.length == 2)              
            { 
                creepBuilders.push(new this.creepBuilder('I', 'Z', 'Z', 1, 1)); 
            }
            
        
        ////Upgrade
        creepBuilders.push(new this.creepBuilder('U', 'X', 'Z', 2, 1));
        if(myRoomName == Memory.myMap['K'])  { creepBuilders.push(new this.creepBuilder('T', 'Z', 'Z', 0, 0)); }
  
  
        ////Drones and repair
        //creepBuilders.push(new this.creepBuilder('D', 'X', 'X', 1, 0));
       creepBuilders.push(new this.creepBuilder('D', 'X', 'X', this.getNumDrone(myRoomName), 0));
        creepBuilders.push(new this.creepBuilder('R', 'Z', 'Z', 2, 0));
        
        ////Remote upgrading
        creepBuilders.push(new this.creepBuilder('U', 'K', 'K', 0, 0));
    
        ////Remote Harvest
        if(myRoomName == Memory.myMap['K'])
        {
            creepBuilders.push(new this.creepBuilder('J', 'L', 'K', 1, 0));
            creepBuilders.push(new this.creepBuilder('J', 'N', 'K', 1, 0));
            creepBuilders.push(new this.creepBuilder('J', 'P', 'K', 1, 0));
        }
        
        if(myRoomName == Memory.myMap['I'])
        {
            creepBuilders.push(new this.creepBuilder('J', 'M', 'I', 1, 0));
        }
        
        if(myRoomName == Memory.myMap['O'])
        {
            creepBuilders.push(new this.creepBuilder('J', 'N', 'O', 1, 0));
        }
        
        
        ///Mineral
        if(myRoomName == Memory.myMap['I'])  { creepBuilders.push(new this.creepBuilder('O', 'I', 'I', 0, 0)); }
        if(myRoomName == Memory.myMap['J'])  { creepBuilders.push(new this.creepBuilder('O', 'J', 'J', 1, 0)); }
        if(myRoomName == Memory.myMap['K'])  { creepBuilders.push(new this.creepBuilder('O', 'K', 'K', 0, 0)); }
       
    //  
        
        ////Claim
         creepBuilders.push(new this.creepBuilder('C', 'L', 'L', 0, 0));
 
     
           ////Power
          creepBuilders.push(new this.creepBuilder('P', 'X', 'X', 0, 0));
          creepBuilders.push(new this.creepBuilder('Z', 'X', 'X', 0, 0));
        
        
          ///Scout
            creepBuilders.push(new this.creepBuilder('S', 'X', 'X', 0, 0));
        
        
        
        
        
        
        
        
        
     //   creepBuilders.push(new this.creepBuilder('D', 'Z', 'I', 1, 1));
        
   //     if(myRoomName == Memory.myMap['3'])  { creepBuilders.push(new this.creepBuilder('H', 'Z', 'Z', 2, 0)); }
   //     if(myRoomName == Memory.myMap['I'])  { creepBuilders.push(new this.creepBuilder('H', 'Z', 'Z', 1, 0)); }
   //     if(myRoomName == Memory.myMap['J'])  { creepBuilders.push(new this.creepBuilder('H', 'Z', 'Z', 2, 0)); } 
   //     if(myRoomName == Memory.myMap['K'])  { creepBuilders.push(new this.creepBuilder('H', 'Z', 'Z', 1, 0)); }
        
       
        
   //     if(myRoomName == Memory.myMap['3'])  { creepBuilders.push(new this.creepBuilder('U', 'X', 'Z', 2, 0)); } 
    //    if(myRoomName == Memory.myMap['I'])  { creepBuilders.push(new this.creepBuilder('U', 'X', 'Z', 1, 0)); } 
   //     if(myRoomName == Memory.myMap['J'])  { creepBuilders.push(new this.creepBuilder('U', 'X', 'Z', 1, 0)); } 
    //    if(myRoomName == Memory.myMap['K'])  { creepBuilders.push(new this.creepBuilder('U', 'X', 'Z', 1, 0)); } 
       
    //    if(this.hasMineral(myRoomName))  { creepBuilders.push(new this.creepBuilder('O', 'Z', 'Z', 1, 0)); } 
        
     //   creepBuilders.push(new this.creepBuilder('R', 'X', 'Z', this.getNumRepair(myRoomName), 0));
     //   creepBuilders.push(new this.creepBuilder('D', 'X', 'X', this.getNumDrone(myRoomName), 0));
        
     //   creepBuilders.push(new this.creepBuilder('M', 'M', 'I', 0, 0));
     //   creepBuilders.push(new this.creepBuilder('M', 'N', 'J', 0, 0));
      //  creepBuilders.push(new this.creepBuilder('M', 'O', 'K', 0, 0));
      //  creepBuilders.push(new this.creepBuilder('M', '4', '3', 0, 0));
        
        
     //   creepBuilders.push(new this.creepBuilder('M', 'J', 'J', 1, 0));
        
     //   creepBuilders.push(new this.creepBuilder('U', 'J', 'J', 1, 0));
        
     //   if(myRoomName == Memory.myMap['I'])  { creepBuilders.push(new this.creepBuilder('C', 'Z', '3', 1, 0)); } 
     //   if(myRoomName == Memory.myMap['J'])  { creepBuilders.push(new this.creepBuilder('C', 'Z', '3', 1, 0)); } 
     //   if(myRoomName == Memory.myMap['K'])  { creepBuilders.push(new this.creepBuilder('C', 'Z', '3', 1, 0)); } 
        
        
        
    

      //  console.log('-----------------' + JSON.stringify(Game.rooms[myRoomName])  ) //.mineralAmount);
      //  console.log('-----------------' + targets[0].mineralAmount  ) //.mineralAmount);
         
     
        
        try 
        {
            myEnergyCap = Game.rooms[myRoomName].energyCapacityAvailable;
            this.fillAllCountArrays(myRoomName);   
            
            if(utility.isWar())
            {
                console.log(this.warStatus(myRoomName, creepBuilders) + 'Total:' + ttCount );
                this.warBuild(myRoomName);
            }
            else
            {
                console.log(this.peaceStatus(myRoomName, creepBuilders) + 'Total:' + ttCount );
                this.peaceBuild(myRoomName);
            }
        }
            
        catch(err) 
        {
            console.log(err.toString());
        }
    } ,
    
    hasMineral: function(myRoomName)
    {
        
        // myExt = myRoom.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_EXTRACTOR}});
      //console.log('------------------------------------------mineralAmount = ' +  myRoomName  );
       
        
        myRoom  = Game.rooms[myRoomName];
      //  console.log('------------------------------------------mineralAmount = ' +  myRoom );
    
        myMineral = myRoom.find(FIND_MINERALS);
      //  console.log('------------------------------------------mineralAmount = ' +  myMineral );
        
        myAmount = myMineral[0].mineralAmount;
        console.log('-----mineralAmount = ' +  myAmount ); 
            
        if (myAmount > 0) 
        {
            return true;
        }
        else
        {
            return false;
        }
            
            
        /*
      
        if(myExt.length > 0)
        {
            myCool = myExt[0].cooldown;
            console.log('------------------------------------------mineralAmount = ' +  myCool  ); 
        }
        else
        {
            return false;
        }
      
       */
       
        return true;  
    },
    
    
    getNumDrone: function(myRoomName)
    {
        
      //  return 1;
  
        if (Memory.jobs.length == 0)
        {
            return 0;
        }
        
        
        var valueToReturn = Memory.jobs.length;
        
        valueToReturn = valueToReturn / 20;
        valueToReturn = valueToReturn;
        
        if (valueToReturn > 3) { valueToReturn = 3; }
        
     //    console.log('About to return ' + valueToReturn );
        
        return valueToReturn;
    },
    
    
    getNumRepair: function(myRoomName)
    {
        
        return 10;
        
        if (Memory.repairRoomJobs[myRoomName].length == 0)
        {
            return 0;
        }
        
        var valueToReturn = Memory.repairRoomJobs[myRoomName].length;
        
        valueToReturn = valueToReturn / 10;
        valueToReturn = valueToReturn + 1;
        
        if (valueToReturn > 4) { valueToReturn = 4; }
        
       // console.log('About to return ' + valueToReturn );
        
        return valueToReturn;
    },
    
    warStatus: function(myRoomName, creepBuilders)
    {
            var statusString = '';
            var myColor ;
             var i;   
            for(i=0; i < creepBuilders.length; i++)
            {
                myColor = '88FF88';
                
                if (creepBuilders[i].currentOccurs > creepBuilders[i].minWarOccurs){myColor = '8888FF';}
                if (creepBuilders[i].currentOccurs < creepBuilders[i].minWarOccurs){myColor = 'FF8888';}
                 
                statusString = statusString + '<font color=' + myColor + '>' + creepBuilders[i].myTriple() + ': ' + creepBuilders[i].currentOccurs + '</font>, ' ;
            }
            
            utilityMemory.handleRoomStatus(myRoomName, statusString);
            
            return statusString;
        
    },
    
    peaceStatus: function(myRoomName, creepBuilders)
    {
            var statusString = '';
            var myColor ;
             var i;
            for(i=0; i < creepBuilders.length; i++)
            {
                if(creepBuilders[i].minOccurs > 0)
                {
                    myColor = '88FF88';
                
                    if (creepBuilders[i].currentOccurs > creepBuilders[i].minOccurs){myColor = '8888FF';}
                    if (creepBuilders[i].currentOccurs < creepBuilders[i].minOccurs){myColor = 'FF8888';}
                 
                    statusString = statusString + '<font color=' + myColor + '>' + creepBuilders[i].myTriple() + ': ' + creepBuilders[i].currentOccurs + '</font>, ' ;
                }
            }
            
            utilityMemory.handleRoomStatus(myRoomName, statusString);
            
            return statusString;
        
    },
    
    
    warBuild: function(myRoomName)
    {
         var i;
         for(i=0; i < creepBuilders.length; i++)
            {
                if (creepBuilders[i].currentOccurs < creepBuilders[i].minWarOccurs)
                {
                    this.makeCreep(this.getEnergyCap(myRoomName), creepBuilders[i].firstLetter, creepBuilders[i].secondLetter, creepBuilders[i].thirdLetter, myRoomName);  
                    return; 
                }
            }
    },
    
    peaceBuild: function(myRoomName)
    {
         var i;
         for(i=0; i < creepBuilders.length; i++)
            {
                if (creepBuilders[i].currentOccurs < creepBuilders[i].minOccurs)
                {
                    this.makeCreep(this.getEnergyCap(myRoomName), creepBuilders[i].firstLetter, creepBuilders[i].secondLetter, creepBuilders[i].thirdLetter, myRoomName);  
                    return; 
                }
            }
    },
    
   
    
    fillAllCountArrays: function(theRoomName)
    {
        for(i=0; i < creepBuilders.length; i++)
        {
            creepBuilders[i].currentOccurs = this.fillOneCountArray(creepBuilders[i].myTriple(), theRoomName);   ; 
        }
        
        var total = _.filter(Game.creeps, (creep) => creep.memory.role != 'zzzzzz' && creep.memory.homeRoom ==  theRoomName);
        ttCount = total.length;
        
    },
    
    
    fillOneCountArray: function(triple, theRoomName)
    {
        var tempArray = _.filter(Game.creeps, (creep) => creep.memory.myTriple == triple && creep.memory.homeRoom ==  theRoomName);
        return tempArray.length;
    },


    getUseableEnergy: function(myEnergyCap,  myRoomName)
    {
        var myScreeps = Game.rooms[myRoomName].find(FIND_MY_CREEPS);
        
        
        if(myEnergyCap < 350)       { return 300; } 
       // if(myEnergyCap > 2100)      { return 1800; } 
        
        //return myEnergyCap - 600; 
        return myEnergyCap * .80 ; 
    },


    makeCreep: function(myEnergyCap, firstLetter, secondLetter, thirdLetter,  myRoomName)
    {
      //  console.log('got into makeCreep');
        
        useableEnergy = this.getUseableEnergy(myEnergyCap,  myRoomName);
      //  console.log('usable energy = ' + useableEnergy);
    
        var myScreeps = Game.rooms[myRoomName].find(FIND_MY_CREEPS);
      //  console.log("numScreeps = " + myScreeps.length);

        
        var numEachPart = parseInt((useableEnergy / 200));
        if (numEachPart > 15) {numEachPart = 15 };
     //   console.log('numEachPart = ' + numEachPart );
        
        var aParts  = 0;
        var cParts  = numEachPart;
        var clParts = 0;
        var hParts  = 0;
        var mParts  = numEachPart;
        var rParts  = 0;
        var tParts  = 0;
        var wParts  = numEachPart;
        
        
        if(firstLetter == 'A') { wParts = 0; cParts = 0; mParts = 6; aParts = 2; tParts = 2; }
        if(firstLetter == 'B') { wParts = 0; cParts = 0; mParts++; aParts = numEachPart; tParts = numEachPart; }
        if(firstLetter == 'C') {clParts = 1; cParts = 0; wParts = 0; mParts = 1; }
        if(firstLetter == 'E') { wParts = 0; mParts = 2; cParts = 4; }
      //  if(firstLetter == 'O') { cParts = 4; wParts = 7; mParts = 6; }
        if(firstLetter == 'P') { wParts = 0; cParts = 0; mParts++; aParts = numEachPart; }
        if(firstLetter == 'S') { cParts = 0; mParts = 2; wParts = 0; }
        if(firstLetter == 'T') { cParts = 1; mParts = 10; wParts = 25; }
        
        if(firstLetter == 'U') { cParts = 4 ; mParts = 4; wParts = 4; }
        if(firstLetter == 'R') { cParts = 4 ; mParts = 4; wParts = 4; }
        
         
            
        if(useableEnergy > 1250)
        {
        
            
            if(firstLetter == 'I' || firstLetter == 'D' || firstLetter == 'U')
            {
                wParts = 6;
                cParts = 6;
                mParts = 6;
            }
            
            
            if(firstLetter == 'H')
            {
                wParts = 3;
                cParts = 3;
                mParts = 3;
            }
       
           
        }
        
        if(firstLetter == 'Z') 
        {   
            var numEachHeal = (myEnergyCap - 400) / 300;
            console.log('numEachHeal = ' + numEachHeal );
            
            hParts = numEachHeal; 
            mParts = numEachHeal;  
            wParts = 0; 
            cParts = 0;
            
        }
       
        this.doBuild(aParts,    cParts,   clParts,  hParts,  mParts,   rParts,    tParts,   wParts, firstLetter, secondLetter, thirdLetter,  myRoomName   ); 
       
        return;
    },
    
    
    
    doBuild: function(numAttack, numCarry, numClaim, numHeal, numMove, numRanged, numTough, numWork, firstLetter, secondLetter, thirdLetter,  myRoomName)
    {
     //  console.log('myRoomName' + myRoomName);
        var mySpawn;
        var buildInfo = [];
        
        var theTriple =  firstLetter + secondLetter + thirdLetter
        var creepCost = ((numAttack * 80) + (numCarry * 50) + (numClaim * 600) + (numHeal * 250) + (numMove * 50) + (numRanged * 150) + (numTough * 10) + (numWork * 100));
       // var randNum = Math.floor((Math.random() * 9));
        //var creepName = theTriple + numMove ;
        var creepName = theTriple + creepCost ;
        var mySpawns = Game.rooms[myRoomName].find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_SPAWN   } });
        
        
        for(i=0; i < numTough; i++)     { buildInfo.push(TOUGH);  }
        for(i=0; i < numCarry; i++)     { buildInfo.push(CARRY);  }
        for(i=0; i < numClaim; i++)     { buildInfo.push(CLAIM);  }
        for(i=0; i < numMove; i++)      { buildInfo.push(MOVE);  }
        for(i=0; i < numRanged; i++)    { buildInfo.push(RANGED_ATTACK);  }
        for(i=0; i < numWork; i++)      { buildInfo.push(WORK);  }
        for(i=0; i < numAttack; i++)    { buildInfo.push(ATTACK);  }
        for(i=0; i < numHeal; i++)      { buildInfo.push(HEAL);  }
        
        if(firstLetter == 'P')   {buildInfo.push(TOUGH);  buildInfo.push(MOVE);  }
        
        
    //   console.log(buildInfo.toString());
         
    
        for(i = 0; i < mySpawns.length; i++)
        {
            console.log('i = ' + 1);
        
            mySpawn = mySpawns[i] ;
      
            var newCreep = mySpawn.createCreep(buildInfo, creepName, {myFirstLetter: firstLetter, mySecondLetter: secondLetter, myThirdLetter: thirdLetter, myTriple: theTriple, myType: firstLetter, homeRoom: myRoomName});
            console.log('Trying to build ' + creepName + ' cost will be ' + creepCost + ' result was ' + newCreep  );
            
            while (newCreep == -3) 
            {
                creepName = creepName + '_';
                var newCreep = mySpawn.createCreep(buildInfo, creepName, {myFirstLetter: firstLetter, mySecondLetter: secondLetter, myThirdLetter: thirdLetter, myTriple: theTriple, myType: firstLetter, homeRoom: myRoomName});
                console.log('Trying to build ' + creepName + ' cost will be ' + creepCost + ' result was ' + newCreep  );
                
            }
            
            if (newCreep != -4)  {return;}
        }
    },
    
    
    
    getEnergyCap: function(myRoomName)
    {
        return Game.rooms[myRoomName].energyCapacityAvailable;
    },
    
    
    
    
    creepBuilder: class 
    {
        constructor(firstLetter, secondLetter, thirdLetter, minOccurs, minWarOccurs) 
        {
            this.guid =  this.newGuid();
            this.gameTime = Game.time;
            this.firstLetter = firstLetter;
            this.secondLetter = secondLetter;
            this.thirdLetter = thirdLetter;
            this.minOccurs = minOccurs;
            this.minWarOccurs = minWarOccurs ;
            this.currentOccurs = 0;
        } 
        
        myTriple() {return this.firstLetter + this.secondLetter + this.thirdLetter;}
        
        S4() {return (((1+Math.random())*0x10000)|0).toString(16).substring(1); }
        
        newGuid() {return (this.S4() + this.S4() + "-" + this.S4() + "-4" +this. S4().substr(0,3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();}
    }
}

module.exports = utilitySpawn;
