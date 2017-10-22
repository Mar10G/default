var utility = require('utility');


        
var utilityMemory = {

    cleanDeadDrones: function()
    {
        for(var name in Memory.creeps) 
        {
            if(!Game.creeps[name]) 
            {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    
    handleRoomStatus: function(theRoomName, status)
    {
        if(Memory.roomStatus == undefined)
        {
          //  console.log('got here 1');
            Memory.roomStatus = {}
        }
        
     //   Memory.roomStatus = {}
        Memory.roomStatus[theRoomName] = status;
        
    },
    
     handleRoomMineral: function(theRoomName, theMineral)
    {
        if(Memory.roomMineral == undefined)
        {
          //  console.log('got here 1');
            Memory.roomMineral = {}
        }
        
     //   Memory.roomStatus = {}
        Memory.roomMineral[theRoomName] = theMineral;
        
    },
    
    doRoomMineral: function(theRoomName)
    {
      
    //  console.log('BEGIN doRommMineral ' + theRoomName)  ;
      
      
       var currentMineral;
        
            for(var i=0; i < Memory.myMinerals.length; i++)
            {
                currentMineral = Memory.myMinerals[i];
            
             //   console.log(currentMineral.mineralName);
                
            }
            
            
     //   console.log(theRoomName.Mineral.mineralType)
     tempRoom = Game.rooms[theRoomName] ;
     
     targets = tempRoom.find(FIND_MINERALS);
     
   //  console.log( targets.length )
            
    //  console.log('END doRommMineral ' + theRoomName)  ;
    },
    
    
    
    
    handleCreepCPU: function(myCreep, elapsed)
    {
        if(myCreep.memory.myCPU == undefined)
        {
          //  console.log('got here 1');
            myCreep.memory.myCPU = [];
        }
       
       var myTick = Game.time % 100
    
        myCreep.memory.myCPU[myTick] = elapsed ;
        
        var minValue = 999;
        var maxValue = 0;
        var runningTotal = 0;
        
        for(var i=0; i < myCreep.memory.myCPU.length; i++)
        {
           if (myCreep.memory.myCPU[i] < minValue){minValue = myCreep.memory.myCPU[i];}
           if (myCreep.memory.myCPU[i] > maxValue){maxValue = myCreep.memory.myCPU[i];}
            
            runningTotal = runningTotal + myCreep.memory.myCPU[i];
        }
        
   //     console.log(myCreep.name + ' Min: ' + parseFloat(minValue).toFixed(2) + ', Max: ' + parseFloat(maxValue).toFixed(2) + ', Avg: ' + parseFloat(runningTotal / myCreep.memory.myCPU.length).toFixed(2)  );
        
      //  myArray = [];
     //   myArray.push(7);
        
      //  this.writeToMemory('myCPU', myArray);
    },
    
    handleCPU: function()
    {
        
        return 0;
        
       var myTick = Game.time % 200
    
        Memory.myCPU[myTick] = Game.cpu.getUsed() ;
        
        var minValue = 999;
        var maxValue = 0;
        var runningTotal = 0;
        
        for(var i=0; i < Memory.myCPU.length; i++)
        {
           if (Memory.myCPU[i] < minValue){minValue = Memory.myCPU[i];}
           if (Memory.myCPU[i] > maxValue){maxValue = Memory.myCPU[i];}
            
            runningTotal = runningTotal + Memory.myCPU[i];
        }
        
        Memory.MINcpu = parseFloat(minValue).toFixed(2);
        Memory.MAXcpu = parseFloat(maxValue).toFixed(2);
        Memory.AVGcpu = parseFloat(runningTotal / Memory.myCPU.length).toFixed(2);
        
        console.log('Min: ' + Memory.MINcpu + ', Max: ' + Memory.MAXcpu + ', Avg: ' + Memory.AVGcpu   );
        
      //  myArray = [];
     //   myArray.push(7);
        
      //  this.writeToMemory('myCPU', myArray);
    },
    
    getEnergyCap: function(myRoomName)
    {
        return Game.rooms[myRoomName].energyCapacityAvailable;
    },
    
    handleMineralList: function()
    {
        tempArray = [];
        
        tempArray.push(new this.mineral(RESOURCE_OXYGEN,                    0.44, 0.45, false, true) );
    
    
    
    
    
    //    tempArray.push(new this.mineral(RESOURCE_UTRIUM,                    0.12, 0.12, false, false) );
    //    tempArray.push(new this.mineral(RESOURCE_KEANIUM,                     0.25, 0.19, false, true) );
          tempArray.push(new this.mineral(RESOURCE_HYDROGEN,                    0.50, 0.90, false, true) );
    //    tempArray.push(new this.mineral(RESOURCE_CATALYST,                    0.50, 0.40, false, true) );
         tempArray.push(new this.mineral(RESOURCE_CATALYZED_GHODIUM_ACID,    4.50, 4.50, false, false, 'upgradeController', 3, 0) );
        
        
        
        
        
      //  tempArray.push(new this.mineral(RESOURCE_UTRIUM_OXIDE,              4.00, 4.00, false, false, 'harvest', 1, -1) );
      //  tempArray.push(new this.mineral(RESOURCE_UTRIUM_ALKALIDE,           9.99, 9.99, false, false, 'harvest', 2, -1) );
      //  tempArray.push(new this.mineral(RESOURCE_CATALYZED_UTRIUM_ALKALIDE, 3.10, 3.10, true, false, 'harvest', 3, 0) );
        
      //  tempArray.push(new this.mineral(RESOURCE_KEANIUM_HYDRIDE,           7.00, 7.00, false, false, 'capacity', 1, -1) );
     //   tempArray.push(new this.mineral(RESOURCE_KEANIUM_ACID,              9.99, 9.99, false, false, 'capacity', 2, -1) );
      //  tempArray.push(new this.mineral(RESOURCE_CATALYZED_KEANIUM_ACID,    3.25, 3.25, false, false, 'capacity', 3, 1) );
        
      //  tempArray.push(new this.mineral(RESOURCE_GHODIUM_HYDRIDE,           9.99, 9.99, false, false, 'upgradeController', 1, -1) );
     //   tempArray.push(new this.mineral(RESOURCE_GHODIUM_ACID,              6.00, 6.00, false, false, 'upgradeController', 2, -1) );
        
        
      //  tempArray.push(new this.mineral(RESOURCE_POWER,                   7.95, 7.95, false, false) );
       // tempArray.push(new this.mineral(RESOURCE_ENERGY,                   7.95, 7.95, false, false) );
        
        this.writeToMemory('myMinerals', tempArray);
    },
    
    handleBoostList: function()
    {
        var myBoost = {};
        
        myBoost['harvest'] = WORK;
        myBoost['upgradeController'] = WORK;
        myBoost['capacity'] = CARRY;
        myBoost['attack'] = ATTACK;
        myBoost['rangedAttack'] = RANGED_ATTACK;
        myBoost['repairBuild'] = WORK;
        myBoost['heal'] = HEAL;
        myBoost['dismantle'] = WORK;
        myBoost['move'] = MOVE;
        myBoost['tough'] = TOUGH;
        
        this.writeToMemory('myBoost', myBoost);
        
    },
    
    handleMapCache: function()
    {
       console.log('map cache');
        
        var myMap = {};
        
        
     //   myMap = this.addToMap('A', 'W48S8', myMap); 
        
        myMap = this.addToMap('A', 'W49S6', myMap);   myMap = this.addToMap('B', 'W48S6', myMap);  myMap = this.addToMap('C', 'W47S6', myMap);   myMap = this.addToMap('D', 'W46S6', myMap);
        myMap = this.addToMap('E', 'W49S7', myMap);   myMap = this.addToMap('F', 'W48S7', myMap);  myMap = this.addToMap('G', 'W47S7', myMap);   myMap = this.addToMap('H', 'W46S7', myMap);
        myMap = this.addToMap('I', 'W49S8', myMap);   myMap = this.addToMap('J', 'W48S8', myMap);  myMap = this.addToMap('K', 'W47S8', myMap);   myMap = this.addToMap('L', 'W46S8', myMap);
        myMap = this.addToMap('M', 'W49S9', myMap);   myMap = this.addToMap('N', 'W48S9', myMap);  myMap = this.addToMap('O', 'W47S9', myMap);   myMap = this.addToMap('P', 'W46S9', myMap);
     
    
        myMap = this.addToMap(1, 'W50S7', myMap);
        myMap = this.addToMap(2, 'W50S8', myMap);
        myMap = this.addToMap(3, 'W50S9', myMap);
        myMap = this.addToMap(4, 'W50S10', myMap);
        myMap = this.addToMap(5, 'W49S10', myMap);
        myMap = this.addToMap(6, 'W48S10', myMap);
        myMap = this.addToMap(7, 'W47S10', myMap);
        myMap = this.addToMap(8, 'W46S10', myMap);
        myMap = this.addToMap(9, 'W45S10', myMap);
        
        this.writeToMemory('myMap', myMap);
    },
    
    addToMap: function(a, b, theMap)
    {
        theMap[a] = b;
        theMap[b] = a;
        return theMap;
    },
    
    writeToMemory: function(nameToUse, valueToWrite)
    {
        Memory[nameToUse] = valueToWrite;
    },
    
    clearWar: function()
    {
        Memory.roomsAtWar = [];
    },
    
    mineral: class 
    {
        constructor(mineralName, buyPrice, sellPrice, isBuy, isSell, boostType, boostLevel, labToLoad) 
        {
            this.guid =  this.newGuid();
            this.gameTime = Game.time;
            this.mineralName = mineralName;
            this.buyPrice = buyPrice;
            this.sellPrice = sellPrice;
            this.isBuy = isBuy;
            this.isSell = isSell;
            this.boostType = boostType;
            this.boostLevel = boostLevel;
          //  this.boostPart = boostPart;
            this.labToLoad = labToLoad;
        } 
    
        S4() {return (((1+Math.random())*0x10000)|0).toString(16).substring(1); }
        
        newGuid() {return (this.S4() + this.S4() + "-" + this.S4() + "-4" +this. S4().substr(0,3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();}
    }

}
module.exports = utilityMemory;

















