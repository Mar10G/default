var ageLimit = 500;

var roadDamageThreshold = 2000;
var containerDamageThreshold = 100000;

var baseThreshold = 1000;
var repairMultiply = 1.25;

//var thresholdIncreaser = 2.5  ;
//var rampartDamageThreshold = baseThreshold * thresholdIncreaser;
//var rampartRepairThreshold = baseThreshold * thresholdIncreaser * 2;
//var wallDamageThreshold = baseThreshold * thresholdIncreaser;
//var wallRepairThreshold = baseThreshold * thresholdIncreaser * 2;

var needingRepair;
var targets;
var targetObject;
var currentJob;
var currentRoom;
var item;
//var i = 0;

var mineralThershold = 500;

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



var repairLogic = 
{
    
    main: function() 
    {
     //   console.log('in main repair logic');
        
        if(this.isOnInterval(2)){ this.cleanJobs(); }
        
        if(this.isOnInterval(1)){ this.makeJobs(); }
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
           console.log('currentRoom ' + currentRoom);
            
            this.repairRoadJobs(currentRoom);
            this.repairRampartJobs(currentRoom);
            this.repairWallJobs(currentRoom);
            console.log('repait wall');
            this.repairContainerJobs(currentRoom);
            
        }
        
        //   Memory.thresholdIncreaser = 1;
        
       //  if ( Memory.jobs.length < 1 )  { Memory.thresholdIncreaser = Memory.thresholdIncreaser + 1; }
        
        
    },
    
    /*
    getLowThreshold: function(theRoom)
    {
        var valueToReturn = baseThreshold * (theRoom.controller.level * 2)  * Memory.thresholdIncreaser;
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
    
   
    */
    
    repairRoadJobs: function(theRoom)
    {
        console.log('looking at roads');
        targets = theRoom.find(FIND_STRUCTURES, {filter: (structure) => {return structure.structureType ==  STRUCTURE_ROAD && structure.hits <  200 ;} });
        targets =  Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_ROAD } } );
        console.log(targets.length + '# roads');
     //   console.log(theRoom);
     //   console.log(theRoom.toString());
        
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
        
        var x = (1 / repairMultiply) * utility.getLowThreshold(theRoom);
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
       
        var x =  (1 / repairMultiply) * utility.getLowThreshold(theRoom);
        
         console.log('low = ' + utility.getLowThreshold(theRoom));
         console.log('x = ' + x);
          
        targets = theRoom.find(FIND_STRUCTURES, {filter: function(object){return object.structureType == STRUCTURE_WALL && object.hits < x ;} });
        
         console.log('targets = ' + targets.length);
        
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
        console.log('INTO ADD JOB IN REPAIR ' + currentRoom)
        
        if(Memory.repairRoomJobs[currentRoom.name] == undefined )
        {
            Memory.repairRoomJobs[currentRoom.name] =  [];
        }
        
        
        var jobsArray = Memory.repairRoomJobs[currentRoom.name] ; 
        
        if(!this.isJobInList(jobToAdd))
        {
            jobsArray.push(jobToAdd);
            Memory.repairRoomJobs[currentRoom.name] = jobsArray;
            
         //   console.log('repair job added to room ' + currentRoom.name);
        }
      
    },
    
   
    /*
    removeRoomRepairJob: function(jobToRemove, currentRoom)
    {
         console.log('**********************Removing job = ' + jobID);
         var jobsArray = Memory.repairRoomJobs[currentRoom.name];
         var currentJob;
         var i = 0
         
         for(i=0; i < jobsArray.length; i++)
         {
            currentJob = jobsArray[i];
            if(currentJob.guid == jobID)
            {
                jobsArray.splice(i,1);
                Memory.repairRoomJobs[currentRoom.name] = jobsArray;
                return;
            }
             
         }
        
    },
    
    */
    
    isJobInList: function(jobToCheck)
    {
        var myOccurs = this.jobOccurs(jobToCheck);
        var myNeedOccurs = 1;
        
    
 
        
        if(myOccurs >= myNeedOccurs) 
        {
        //    console.log('job is in list');
            return true;
            
        }
        
      //  console.log('job NOT in list');
        return false;        
    },
    
    jobOccurs: function(jobToCheck)
    {
        var i = 0;
        var jobsArray = Memory.repairRoomJobs[currentRoom.name]
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
         var jobsArray = Memory.repairRoomJobs[currentRoom.name];
         var currentJob;
         var i = 0
         
         for(i=0; i < jobsArray.length; i++)
         {
            currentJob = jobsArray[i];
            if(currentJob.guid == jobID)
            {
                jobsArray.splice(i,1);
                Memory.repairRoomJobs[currentRoom.name] = jobsArray;
                return;
            }
             
         }
         
          
    },
    
    
    cleanJobs: function()
    {
         console.log('cleaning jobs');
        
         if(Memory.repairRoomJobs  == undefined )
            {
                Memory.repairRoomJobs  =  [];
            }
        
        for(var myName in Game.rooms) 
        {
            currentRoom = Game.rooms[myName];
            console.log('--------------------------------------cleaning  currentRoom ' + currentRoom);
            
            if(Memory.repairRoomJobs[currentRoom.name] == undefined )  
            {
                console.log('--------------------------------------cleaning  currentRoom ' + currentRoom);
                Memory.repairRoomJobs[currentRoom.name] =  [];
            }
        
            
            this.cleanOldJobs(currentRoom);
            this.cleanFinishedJobs(currentRoom);
        }
    },
    
    
    cleanOldJobs: function(currentRoom)
    {
        var i = 0;
        var jobsArray = Memory.repairRoomJobs[currentRoom.name];
        var currentJob;
        
        for(i=0; i < jobsArray.length; i++)
        {
            currentJob = jobsArray[i];
            
            if(currentJob.gameTime + ageLimit < Game.time )
            {
                jobsArray.splice(i,1);
            }
        }
        
        Memory.repairRoomJobs[currentRoom.name]  = jobsArray;
    },
    
 
 
    
    cleanFinishedJobs: function(currentRoom)
    {
       // console.log('cleaning finished jobs');
        var i = 0;
        var jobsArray = Memory.repairRoomJobs[currentRoom.name];
        var currentJob;
        
        for(i=0; i < jobsArray.length; i++)
        {
            currentJob = jobsArray[i];
            
            if(currentJob.action == 'repair')   { if(this.isRepaired(currentJob.structureID)) { this.removeJob(currentJob.guid) } }
       //     if(currentJob.action == 'charge')   { if(this.isCharged(currentJob.structureID, currentJob.myMineral)) { this.removeJob(currentJob.guid) } }
       //     if(currentJob.action == 'build')    { if(this.isBuilt(currentJob.structureID)) { this.removeJob(currentJob.guid) } }
       //     if(currentJob.action == 'transfer') { if(this.isDoneTransfer(currentJob.structureID)) { this.removeJob(currentJob.guid) } }
       //     if(currentJob.action == 'loadLab')  { if(this.isLabLoaded(currentJob.structureID, currentJob.myMineral)) { this.removeJob(currentJob.guid) } }
        //    if(currentJob.action == 'pickup')   { if(this.isPickedup(currentJob.structureID)) { this.removeJob(currentJob.guid) } }
       //     if(currentJob.action == 'empty')    { if(this.isEmpty(currentJob.structureID)) { this.removeJob(currentJob.guid) } }
            
        }
        
      //  Memory.jobs = jobsArray;
      
  
    },
    
    
 
 
    /*
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
 */
 
 
 
    isRepaired: function(structureID)
    {
       // var targetObjectArray = Game.rooms[myRoomName].find(FIND_STRUCTURES, {filter: (structure) => {return (structure.id == structureID)}});
       // var targetObject =  targetObjectArray[0];
        
        targetObject =  Game.getObjectById(structureID);
        
        if (targetObject == "undefined") {return true;}
        if (targetObject == null) {return true;}
        if (typeof(targetObject) === "undefined") {return true;}
      //  console.log(targetObject.structureType);
        
        
        if(targetObject.structureType == 'rampart' || targetObject.structureType == 'constructedWall')
        {
            if(targetObject.hits >= (repairMultiply * utility.getHighThreshold(structureID) )){return true;}
        }
        else
        {
            if(targetObject.hits ==  targetObject.hitsMax){return true;}
        }
        
         return false;
        
    },
 
 
 isCharged: function(structureID, resource)
    {
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


module.exports = repairLogic;