var ageLimit = 500;

var roadDamageThreshold = 2000;
var containerDamageThreshold = 100000;

var baseThreshold = 1000;
var thresholdIncreaser = 2.5  ;
var rampartDamageThreshold = baseThreshold * thresholdIncreaser;
var rampartRepairThreshold = baseThreshold * thresholdIncreaser * 2;
var wallDamageThreshold = baseThreshold * thresholdIncreaser;
var wallRepairThreshold = baseThreshold * thresholdIncreaser * 2;

var needingRepair;
var targets;
var targetObject;
var currentJob;
var currentRoom;
var item;
//var i = 0;

var mineralThershold = 500;

var droppedPowerPriority      =  1055;
var towerChargePriority         = 999;
var droppedResourcePriority     =  55;
var loadLabPriority             =  39;
var termChargePriority          =  38;
var moveMineralToTermPriority   =  37;
var containerRepairPriority     =  35;
var rampartRepairPriority       =  15;
var wallRepairPriority          =  14;
var roadRepairPriority          =  11;
var buildPriority               =   4;
var upgradePriority             =   1;

var utility = require('utility');



var droneLogic = 
{
    
    main: function() 
    {
         console.log('# Jobs = ' + Memory.jobs.length);
        
        
        if(this.isOnInterval(1)){ this.cleanJobs(); }
        
        if(this.isOnInterval(13)){ this.makeJobs(); }
    },
    
    isOnInterval: function(interval)
    {
        if(Game.time % interval == 0) {return true;}
        return false;
    },
    
    
    makeJobs: function()
    {
        for(var myName in Game.rooms) 
        {
            currentRoom = Game.rooms[myName];
          //  console.log('currentRoom ' + currentRoom);
            
            this.repairRoadJobs(currentRoom);
            this.repairRampartJobs(currentRoom);
            this.repairWallJobs(currentRoom);
            this.repairContainerJobs(currentRoom);
            this.chargeTowerJobs(currentRoom);
          //  this.chargeTermJobs(currentRoom);
            this.buildJobs(currentRoom);
          //  this.upgradeJobs(currentRoom);
          //  this.mineralToTermJobs(currentRoom);
           this.pickupDroppedJobs(currentRoom);
           this.chargeLabJobs(currentRoom);
              this.loadLabJobs(currentRoom);
         //   this.emptyLabJobs(currentRoom);
            
         //    this.energyToLinkJobs(currentRoom);
        
        // this.chargeSpawnJobs(currentRoom);
        
        }
        
         Memory.thresholdIncreaser = 1;
        
        //   if ( Memory.jobs.length < 1 )  { Memory.thresholdIncreaser = Memory.thresholdIncreaser + 1; }
        
        
    },
    
    /*
    getLowThreshold: function(theRoom)
    {
        var valueToReturn = baseThreshold * theRoom.controller.level * Memory.thresholdIncreaser;
     //   console.log(theRoom + ' low threshold = ' + valueToReturn);
        return valueToReturn;
    },
    
    getHighThreshold: function(structureID)
    {
        var theObject =  Game.getObjectById(structureID);
        var theRoom = theObject.room;
        
     //   console.log(theRoom);
        
        var valueToReturn = 2 * this.getLowThreshold(theRoom);
     //   console.log('high threshold = ' + valueToReturn);
        return valueToReturn;
    
    },
    
    emptyLabJobs: function(theRoom)
    {
        targets = theRoom.find(FIND_MY_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LAB });
        
        for(i=0; i < targets.length; i++)
        {
            var item = targets[i];
            
            if (item.mineralAmount > 0)
            {
                this.addJob(new this.Job('empty', item, loadLabPriority) ) ;
            }
        }
        
    },
    */
    
    chargeLabJobs: function(theRoom)
    {
        targets = theRoom.find(FIND_MY_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LAB });
        
        for(i=0; i < targets.length; i++)
        {
            var item = targets[i];
            
            if (item.energy < 500)
            {
                
                this.addJob(new this.Job('charge', item, loadLabPriority) ) ;
            }
        }
        
    },
    
    loadLabJobs: function(theRoom)
    {
        console.log('into loadLabJobs');
        
        labs = theRoom.find(FIND_MY_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_LAB });
        
        if(labs.length > 0)
        {
            var currentMineral;
            var myTerm = theRoom.terminal;
            var amountInTerm;
            var amountInLab;
            
            for(i=0; i < Memory.myMinerals.length; i++)
            {
                currentMineral = Memory.myMinerals[i];
                
                console.log(currentMineral.mineralName);
                
                if(currentMineral.labToLoad >= 0)
                {
                    amountInTerm = utility.getAmountInTerm(currentMineral.mineralName, theRoom.name);
                    amountInLab = labs[currentMineral.labToLoad].mineralAmount
                  
                    console.log(currentMineral.mineralName + ' in Term ' + amountInTerm);
                    console.log(currentMineral.mineralName + ' in Lab ' + amountInLab);
                  
                    if(amountInTerm > 100 && amountInLab < 100)
                    {
                        console.log(' creating job for ' + currentMineral.mineralName + amountInTerm + ' ' + amountInLab  );
                        this.addJob(new this.Job('loadLab', labs[currentMineral.labToLoad], loadLabPriority, currentMineral.mineralName ));
                
                    }
                }
            }
        }
        
        return ;
    
    },
    
    pickupDroppedJobs: function(theRoom)
    {
        targets = theRoom.find(FIND_DROPPED_RESOURCES, {filter: (i) => i.amount > 500 });
        console.log('-------------------------------------dropped = ' + targets.length);
        
        for(i=0; i < targets.length; i++)
        {
            var item = targets[i];
            targetObject =  Game.getObjectById(item.ID);
            console.log('-------------------------------------dropped = ' + JSON.stringify(targetObject));
            
            
            var currentJob = new this.Job('pickup', item, droppedResourcePriority);
            
            console.log(theRoom.name + ': ' + item.amount )
            
            this.addJob(currentJob);
        }
        
    },
    
    
    mineralToTermJobs: function(theRoom)
    {
        targets = theRoom.find(FIND_STRUCTURES, {filter: (i) => i.structureType == STRUCTURE_CONTAINER &&  i.store[RESOURCE_OXYGEN] > 500 });
        
       // console.log(theRoom.name + ': ' + targets.length )
        
       
        for(i=0; i < targets.length; i++)
        {
            var item = targets[i];
            var currentJob = new this.Job('transfer', item, moveMineralToTermPriority);
            this.addJob(currentJob);
        }
        
    },
    
    energyToLinkJobs: function(theRoom)
    {
        if(theRoom.name == Memory.myMap['P'])
        {
            targets = theRoom.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER} });
       
            if(targets.length > 0)
            {
                var item = targets[0];
                this.addJob(new this.Job('chargeLink', item, 1));
            }    
            
        
         
            targets = theRoom.find(FIND_MY_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_TERMINAL && structure.energy > 10000 ; } });
            
            if(targets.length > 0)
            {
                var item = targets[0];
                this.addJob(new this.Job('chargeLink', item, 1));
            }    
            
            
        }
     
         
    },
    
    energyFromLinkJobs: function()
    {
        targets = theRoom.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_CONTROLLER} });
        
      
        for(i=0; i < targets.length; i++)
        {
            var item = targets[i];
            var currentJob = new this.Job('upgrade', item, 1);
            this.addJob(currentJob);
        }
    },
    
    upgradeJobs: function(theRoom)
    {
        targets = theRoom.find(FIND_MY_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_CONTROLLER} });
        
        for(i=0; i < targets.length; i++)
        {
            var item = targets[i];
            this.addJob(new this.Job('upgrade', item, upgradePriority));
        }
    },
    
        
    buildJobs: function(theRoom)
    {
      //  console.log('the room ' + theRoom);
        
        targets = theRoom.find(FIND_CONSTRUCTION_SITES);;
 
        for(i=0; i < targets.length; i++)
        {
            item = targets[i];
            
          //  console.log('target ----' + item.structureType);
            
            
            if(item.structureType == STRUCTURE_SPAWN)
            {
                console.log('HIGH PRIORITY');
                currentJob = new this.Job('build', item, buildPriority * 10);
            }
            else
            {
                currentJob = new this.Job('build', item, buildPriority);
            }
            this.addJob(currentJob);
        }
        
    },
    
    chargeSpawnJobs: function(theRoom)
    {
        targets = theRoom.find(FIND_MY_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity; } });
        
        for(i=0; i < targets.length; i++)
        {
            item = targets[i];
            currentJob = new this.Job('charge', item, 50);
            this.addJob(currentJob);
        }
    },
    
    
    chargeTowerJobs: function(theRoom)
    {
        targets = theRoom.find(FIND_MY_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity; } });
        
        for(i=0; i < targets.length; i++)
        {
            item = targets[i];
            currentJob = new this.Job('charge', item, towerChargePriority);
            this.addJob(currentJob);
        }
    },
    
    chargeTermJobs: function(theRoom)
    {
        console.log(' into charge term jobs');
      //  targets = theRoom.find(FIND_MY_STRUCTURES, {filter: (structure) => {return structure.structureType == STRUCTURE_TERMINAL && structure.store[RESOURCE_ENERGY] < 1000; } });
        theTerm = theRoom.terminal;
        
        if(theTerm != undefined)
        {
          //  console.log(JSON.stringify(theTerm));
            this.addJob(new this.Job('charge', theTerm, termChargePriority, RESOURCE_ENERGY));
        }
        
        /*
        
        
        for(i=0; i < targets.length; i++)
        {
             console.log(' goign to make a charge term job');
            item = targets[i];
            
            console.log(JSON.stringify(item));
            
            currentJob = new this.Job('charge', item, termChargePriority);
            this.addJob(currentJob);
        }
        */
    },
    
    repairRoadJobs: function(theRoom)
    {
        
        targets = theRoom.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType ==  STRUCTURE_ROAD && structure.hits <  200 ;} });
        for(i=0; i < targets.length; i++)
        {
            item = targets[i];
            currentJob = new this.Job('repair', item, roadRepairPriority * 5);
            this.addJob(currentJob);
        }
        
        
        targets = theRoom.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType ==  STRUCTURE_ROAD && structure.hitsMax >  10000  && structure.hits <  5000 ;} });
        for(i=0; i < targets.length; i++)
        {
            item = targets[i];
            currentJob = new this.Job('repair', item, roadRepairPriority * 3);
            this.addJob(currentJob);
        }
        
        
        targets = theRoom.find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_ROAD && object.hits < roadDamageThreshold;} });
        for(i=0; i < targets.length; i++)
        {
            item = targets[i];
            currentJob = new this.Job('repair', item, roadRepairPriority);
            this.addJob(currentJob);
        }
    },
    
    repairRampartJobs: function(theRoom)
    {
        targets = theRoom.find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_RAMPART && object.hits < 1000;} });
        
        for(i=0; i < targets.length; i++)
        {
            item = targets[i];
            currentJob = new this.Job('repair', item, rampartRepairPriority * 10);
            this.addJob(currentJob);
        }
        
        var x = utility.getLowThreshold(theRoom);
        targets = theRoom.find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_RAMPART && object.hits < x ;} });
        
        for(i=0; i < targets.length; i++)
        {
            item = targets[i];
            currentJob = new this.Job('repair', item, rampartRepairPriority);
            this.addJob(currentJob);
        }
    },
    
    repairWallJobs: function(theRoom)
    {
        var x = utility.getLowThreshold(theRoom);
        
        console.log('Low thres =' + x);
        
        targets = theRoom.find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_WALL && object.hits < x ;} });
        
        for(i=0; i < targets.length; i++)
        {
            this.addJob(new this.Job('repair', targets[i], wallRepairPriority));
        }
    },
    
    repairContainerJobs: function(theRoom)
    {
        targets = theRoom.find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_CONTAINER && object.hits < containerDamageThreshold;} });
   
        for(i=0; i < targets.length; i++)
        {
            this.addJob(new this.Job('repair', targets[i], containerRepairPriority));
        }
    },
    
    addJob: function(jobToAdd)
    {
        var jobsArray = Memory.jobs;
    
     //  console.log(this.isJobInList(jobToAdd));
        
        if(!this.isJobInList(jobToAdd))
        {
            jobsArray.push(jobToAdd);
            Memory.jobs = jobsArray;
            
            console.log('job added');
        }
        
        
    },
    
   
    
    
    isJobInList: function(jobToCheck)
    {
        var myOccurs = this.jobOccurs(jobToCheck);
        var myNeedOccurs = 1;
        
        if(jobToCheck.action == 'build')
        {
        //    console.log('myOccurs ' + myOccurs);
            
            var mySite = Game.getObjectById(jobToCheck.structureID);
          
          
            myNeedOccurs = mySite.progressTotal / 1000;
            
            if(myNeedOccurs > 5){myNeedOccurs = 5;}
            
      //      console.log('myNeedOccurs = ' + myNeedOccurs);
            
           // if(myOccurs >= myNeedOccurs) {return true;}
        }
 
        
        if(myOccurs >= myNeedOccurs) {return true;}
        
    //    console.log('job not in list');
        return false;        
    },
    
    jobOccurs: function(jobToCheck)
    {
        var i = 0;
        var jobsArray = Memory.jobs;
        var currentJob;
        var theCount = 0;
        
        for(i=0; i < jobsArray.length; i++)
        {
            currentJob = jobsArray[i];

            if(this.jobsAreEqual(jobToCheck, currentJob))
            {
               theCount++;
            }
        }
        return theCount;
    },

    jobsAreEqual: function(job1, job2)
    {
        if (job1.action != job2.action) {return false};
        if (job1.structureID != job2.structureID) {return false};
        if (job1.priority != job2.priority) {return false}; 
        
        return true;
    },

    
    removeJob: function(jobID)
    {
        console.log('-----------------------Removing job = ' + jobID);
         var jobsArray = Memory.jobs;
         var currentJob;
         var i = 0
         
         for(i=0; i < jobsArray.length; i++)
         {
            currentJob = jobsArray[i];
            if(currentJob.guid == jobID)
            {
                jobsArray.splice(i,1);
                Memory.jobs = jobsArray;
                return;
            }
             
         }
         
        
    },
    
    
    cleanJobs: function()
    {
        
       // Memory.jobs = [];
        
       // console.log('cleaning jobs');
        this.cleanOldJobs();
        this.cleanFinishedJobs();
    },
    
    
    cleanOldJobs: function()
    {
        var i = 0;
        var jobsArray = Memory.jobs;
        var currentJob;
        
       // Memory.jobs = [];
        
        console.log('JOBS = ' + Memory.jobs );
        
        
        for(i=0; i < jobsArray.length; i++)
        {
            currentJob = jobsArray[i];
            
            if(currentJob.gameTime + ageLimit < Game.time )
            {
                jobsArray.splice(i,1);
            }
        }
        
        Memory.jobs = jobsArray;
    },
    
    cleanDeadDrones: function()
    {
        var i = 0;
        var jobsArray = Memory.jobs;
        var currentJob;
        
        for(i=0; i < jobsArray.length; i++)
        {
            currentJob = jobsArray[i];
            
            if(!this.doesDroneExsist(currentJob.droneName))
            {
                jobsArray.splice(i,1);
            }
        }
        
    
        Memory.jobs = jobsArray;
    },
    
    cleanFinishedJobs: function()
    {
       // console.log('cleaning finished jobs');
        var i = 0;
        var jobsArray = Memory.jobs;
        var currentJob;
        
        for(i=0; i < jobsArray.length; i++)
        {
            currentJob = jobsArray[i];
            
            if(currentJob.action == 'repair')   { if(this.isRepaired(currentJob.structureID)) { this.removeJob(currentJob.guid) } }
            if(currentJob.action == 'charge')   { if(this.isCharged(currentJob.structureID, currentJob.myMineral)) { this.removeJob(currentJob.guid) } }
            if(currentJob.action == 'build')    { if(this.isBuilt(currentJob.structureID)) { this.removeJob(currentJob.guid) } }
            if(currentJob.action == 'transfer') { if(this.isDoneTransfer(currentJob.structureID)) { this.removeJob(currentJob.guid) } }
            if(currentJob.action == 'loadLab')  { if(this.isLabLoaded(currentJob.structureID, currentJob.myMineral)) { this.removeJob(currentJob.guid) } }
            if(currentJob.action == 'pickup')   { if(this.isPickedup(currentJob.structureID)) { this.removeJob(currentJob.guid) } }
            if(currentJob.action == 'empty')    { if(this.isEmpty(currentJob.structureID)) { this.removeJob(currentJob.guid) } }
            
        }
        
      //  Memory.jobs = jobsArray;
      
     
    },
    
    
    doesDroneExsist: function(droneName)
    {
        for(i=0; i < myDrones.length; i++)
        {
            var currentDrone = myDrones[i];
            
            if(droneName == currentDrone.name)
            {
                return true;
            }
        }
        
      return false;  
    },
    
    isBuilt: function(siteID)
    {
        var targetObject =  Game.getObjectById(siteID);
        if (targetObject == null) {return true;}
    
        return false;
    },
    
    isPickedup: function(siteID)
    {
        var targetObject =  Game.getObjectById(siteID);
        if (targetObject == null) {return true;}
    
       // return true;
        return false;
    },
    
    isEmpty: function(siteID)
    {
        var targetObject =  Game.getObjectById(siteID);
        if (targetObject == null) {return true;}
        if (targetObject.mineralAmount == 0) {return true;}
    
       // return true;
        return false;
    },
    
    isLabLoaded: function(siteID, resource)
    {
        var targetObject =  Game.getObjectById(siteID);
        if (targetObject == null) {return true;}
        
        
        console.log('resource = ' + resource);
        
        if(resource == RESOURCE_ENERGY)
        {
            if (targetObject.energy > 1000){return true;}
        }
        else
        {
            if (targetObject.mineralAmount > 2900){return true;}
            if (utility.getAmountInTerm(resource, Memory.myMap['P']) == 0) {return true}
        }
        
        
        
    
       // return true;
        return false;
    },
    
    isDoneTransfer: function(structureID)
    {
         console.log('cleaning transer jobs');
      //  var targetObjectArray = Game.rooms[myRoomName].find(FIND_STRUCTURES, {filter: (structure) => {return (structure.id == structureID)}});
         var targetObject =  Game.getObjectById(structureID);
        
        console.log(targetObject.store[RESOURCE_OXYGEN] );
      //  console.log(targetObject.energyCapacity);
        
        console.log('type = ' + typeof(targetObject));
        
        if (typeof(targetObject) === 'undefined') {return true;}
        if (typeof(targetObject) == 'undefined') {return true;}
        if (!(RESOURCE_OXYGEN in targetObject.store)){return true;}
        
        return false;
    },
 
 
    isRepaired: function(structureID)
    {
        targetObject =  Game.getObjectById(structureID);
        
        if (targetObject == "undefined") {return true;}
        if (targetObject == null) {return true;}
        if (typeof(targetObject) === "undefined") {return true;}
      //  console.log(targetObject.structureType);
        
        var objectHealth = targetObject.hits
        var desiredHealth
        
        if(targetObject.structureType == 'rampart' || targetObject.structureType == 'constructedWall')
        {
            desiredHealth = utility.getHighThreshold(structureID)
            
        }
        else
        {
            desiredHealth = targetObject.hitsMax
        }
        
        var percent = objectHealth / desiredHealth
        console.log('Repaired ' + parseFloat(percent * 100).toFixed(2) + '% - ' + objectHealth + ' of ' + desiredHealth + ' ' + targetObject.structureType);
        
        if (objectHealth >= desiredHealth )
        {
            return true;
        }
        else
        {
            return false;
        }
        
         
    },
 
 
 isCharged: function(structureID, resource)
    {
       // return true;
      //  console.log('cleaning charge jobs.   resource = ' + resource);
        
        var targetObject =  Game.getObjectById(structureID);
   
        if (typeof(targetObject) === "undefined") {return true;}
        if (typeof(targetObject) == "undefined") {return true;}
        
        if (targetObject.energy > 0 && targetObject.energy == targetObject.energyCapacity)  {return true;} 
        if (resource != RESOURCE_ENERGY && targetObject.mineralAmount > 2500){return true;}   
        
         if (targetObject.energy == undefined && utility.getAmountInTerm(resource, Memory.myMap['P']) > 1000)  {console.log('hit here 7  '  +  utility.getAmountInTerm(resource, Memory.myMap['P'])  ) ;  return true;} 
        
        return false;
    },
 
    
    
  
    Job: class  
    {
        constructor(myAction, myStructure, myPriority, myMineral) 
        {
            this.droneName = ' ';
            this.structureID = myStructure.id;
            this.action = myAction;
            this.gameTime = Game.time;
            this.isBeingWorked = false;
            this.guid =  this.newGuid();
            this.priority = myPriority;
            this.myLocation = myStructure.pos;
            this.myMineral = myMineral;
        } 
        
        
        
        S4() {return (((1+Math.random())*0x10000)|0).toString(16).substring(1); }
        newGuid() {return (this.S4() + this.S4() + "-" + this.S4() + "-4" +this. S4().substr(0,3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();}
    }
}


module.exports = droneLogic;