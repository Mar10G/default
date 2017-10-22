var utility = require('utility');
var orderAgeThreshold = 25000;
var creditThreshold = 500;
var energyThreshold = 25;
var sellOffSet = 1; 
 
 
        
var utilityMarket = 
{
    placeOrders: function(myRoomName)
    {
        if(myRoomName == Memory.myMap['J'] || myRoomName == Memory.myMap['K'] || myRoomName == Memory.myMap['I'])
        {
            console.log(' cleaning orders in ' + myRoomName);
            this.cleanOrders()
            
            console.log(' making orders in ' + myRoomName);
        
            var currentMineral;
        
            for(var i=0; i < Memory.myMinerals.length; i++)
            {
                currentMineral = Memory.myMinerals[i];
             
                if(currentMineral.isSell)
                {
                    console.log(' selling ' + JSON.stringify(currentMineral));
                    this.makeSellOrder(currentMineral.mineralName, myRoomName, 10000, currentMineral.sellPrice, energyThreshold);
                }
                
                
                if(currentMineral.isBuy)
                {
                    console.log(' buying ' + JSON.stringify(currentMineral));
                    this.makeBuyOrder(currentMineral.mineralName, myRoomName, 10000, currentMineral.buyPrice, energyThreshold);
                }
            }
        } 
        
        if(myRoomName == Memory.myMap['K'])
        {
            console.log(' cleaning orders in ' + myRoomName);
            this.cleanOrders()
            
            console.log(' making orders in ' + myRoomName);
        
            
            
          //  console.log(' buying ' + JSON.stringify(currentMineral));
            this.makeBuyOrder(RESOURCE_ENERGY, myRoomName, 10000, .25, energyThreshold);
          //  this.makeBuyOrder(RESOURCE_CATALYZED_GHODIUM_ACID, myRoomName, 100, 8.00, energyThreshold);
             
        } 
    },
    
    makeBuyOrder: function(resource, myRoomName, targetAmount, targetPrice)
    {
        var numOrders = this.numOpenOrders(resource, myRoomName);
        var amountInTerm = utility.getAmountInTerm(resource, myRoomName);
        var moneyLeftAfter = this.getMoneyLeftAfterOrder(resource, myRoomName, targetAmount, targetPrice);
        
        console.log('AMOUNT of ' + resource + ' = ' + amountInTerm )
        console.log('moneyLeftAfter = ' + moneyLeftAfter )
     
     
      //  return;
        
        if(numOrders < 1 && amountInTerm < 100000 && moneyLeftAfter > creditThreshold)
        {
            Game.market.createOrder(ORDER_BUY, resource, targetPrice, targetAmount, myRoomName);
        }                        
    },
    
    getMoneyLeftAfterOrder: function(resource, myRoomName, targetAmount, targetPrice)
    {
        var openOrdersCost = this.getOpenOrderCost(myRoomName);
        var thisOrderCost = this.getThisOrderCost(targetAmount, targetPrice);
        var myMoney = Game.market.credits;
        
        console.log('openOrdersCost = ' + openOrdersCost)
        console.log('thisOrderCost = ' + thisOrderCost)
        
        return myMoney - (openOrdersCost + thisOrderCost )
        return 7000;
    },
    
    getThisOrderCost: function(targetAmount, targetPrice)
    {
        var vig = targetPrice * targetAmount * 0.05 
        
        return (targetPrice * targetAmount) + vig ;
    },
    
    getOpenOrderCost: function(myRoomName)
    {
        var valueToReturn = 0;
        var myOrders = Game.market.orders;
        var myOrdersArray = this.json2array(myOrders);
      
        var i;
        for(i=0; i < myOrdersArray.length; i++)
        {
            if(myOrdersArray[i].type == "buy")   
            {
                valueToReturn = valueToReturn + (myOrdersArray[i].price * myOrdersArray[i].remainingAmount) ;
            }
        }
        
        return valueToReturn;
    },
    
    remainingCredits: function(targetAmount, targetPrice)
    {
      return   Game.market.credits - this.orderCost(targetAmount, targetPrice)
    },
    
    orderCost: function(targetAmount, targetPrice)
    {
        return targetAmount * targetPrice
    },
    
    makeSellOrder: function(resource, myRoomName, targetAmount, targetPrice)
    {
        var numOrders = this.numOpenOrders(resource, myRoomName);
        console.log('numOrders = ' + numOrders);
        
        if(numOrders < 1)
        {
            var x = Game.market.createOrder(ORDER_SELL, resource, targetPrice * sellOffSet, targetAmount, myRoomName);
            console.log('create order status = ' + x);
            console.log('myRoomName = ' + myRoomName);
            
            
        }                        
    },
    
    numOpenOrders: function(resource, myRoomName)
    {
        var valueToReturn = 0;
        var myOrders = Game.market.orders;
        var myOrdersArray = this.json2array(myOrders);
      
        var i;
        for(i=0; i < myOrdersArray.length; i++)
        {
            if(myOrdersArray[i].resourceType == resource  &&  myOrdersArray[i].roomName == myRoomName ) 
            {
                valueToReturn = valueToReturn + 1;
            }
        }
        
        return valueToReturn;
    },
    
    cleanOrders: function()
    {
        this.cleanOldOrders();
        this.cleanCompletedOrders();
    },
    
    
    cleanCompletedOrders: function()
    {
        var myOrders = Game.market.orders;
     //   console.log(' myOrders  = ' + JSON.stringify(myOrders ) )
        
        var myOrdersArray = this.json2array(myOrders);
      //  console.log (' myOrdersArray.length  = ' + myOrdersArray.length);

        var i;
        for(i=0; i < myOrdersArray.length; i++)
        {
          //  console.log(this.getAge(myOrdersArray[i].created));
            
            if(myOrdersArray[i].remainingAmount == 0)   
            {
                Game.market.cancelOrder(myOrdersArray[i].id);
            }
        }
        
    },
    
    cleanOldOrders: function()
    {
        var myOrders = Game.market.orders;
     //   console.log(' myOrders  = ' + JSON.stringify(myOrders ) )
        
        var myOrdersArray = this.json2array(myOrders);
        console.log (' myOrdersArray.length  = ' + myOrdersArray.length);

        var i;
        for(i=0; i < myOrdersArray.length; i++)
        {
         //   console.log(this.getAge(myOrdersArray[i].created));
            
            if(this.getAge(myOrdersArray[i].created) > orderAgeThreshold)
            {
                Game.market.cancelOrder(myOrdersArray[i].id);
            }
        }
        
    },
    
    getAge: function(ticks)
    {
        return Game.time - ticks;
    },
    
    json2array: function(json)
    {
        var result = [];
        var keys = Object.keys(json);
    
        keys.forEach(function(key){
            result.push(json[key]);
        });
        
    return result;
    },
    
    
    buySome: function(resource, myRoomName, targetAmount, targetPrice, energyLimit)
    {
        var targets = Game.market.getAllOrders(order => order.resourceType == resource && 
	                                order.type == ORDER_SELL && 
	                                order.price < parseFloat(targetPrice)  &&
                                    Game.market.calcTransactionCost(targetAmount, myRoomName, order.roomName) < energyLimit);
                      
        console.log('Buy ' + targetAmount + ' ' + resource + ' at  ' + targetPrice + '   targets.length = ' + targets.length);  
        
        if(targets.length > 0)
        {
            console.log(JSON.stringify(targets[0]));
            this.doBuy(targets[0].id, targetAmount, myRoomName);
        }
                                    
    },
    
    sellSome: function(resource, myRoomName, targetAmount, targetPrice, energyLimit)
    {
        var targets = Game.market.getAllOrders(order => order.resourceType == resource && 
	                                order.type == ORDER_BUY && 
	                                order.price > parseFloat(targetPrice)  &&
	                             //   order.active == true   &&
                                    Game.market.calcTransactionCost(targetAmount, myRoomName, order.roomName) < energyLimit);
                      
          console.log('Sell ' + targetAmount + ' ' + resource + ' at  ' + targetPrice + '   targets.length = ' + targets.length);  
        
        
        if(targets.length > 0)
        {
            console.log(JSON.stringify(targets[0]));
            this.doSell(targets[0].id, targetAmount, myRoomName);
        }
                                    
    },
    
    doSell: function(orderID, amount, myRoomName)
    {
        var result = Game.market.deal(orderID, amount, myRoomName);
        console.log(' result of deal was ' + result);
    },
    
    doBuy: function(orderID, amount, myRoomName)
    {
        var result = Game.market.deal(orderID, amount, myRoomName);
        console.log(' result of deal was ' + result);
    }
}
module.exports = utilityMarket;