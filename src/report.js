const { getTrips, getDriver, getVehicle } = require('api');

/**
 * This function should return the data for drivers in the specified format
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  
    // "totalAmountEarned": 11793.04,
    // "totalCashAmount": 1715.16,
    // "totalNonCashAmount": 10077.87
    
    let getTrip = await getTrips();
    // console.log(getTrip);
  
    let driver=new Set(getTrip.driverID)
    
    function convertNum(numb){
      let acc;
      if(typeof numb ==="string"){
        acc = Number((numb).replace(',',""));  
      }else{
        acc = numb;
      }
  
      return acc;
    }
  
    let allTrips = getTrip.reduce((acc, curr) => {
      if(!acc[curr.driverID]) {
        acc[curr.driverID] = {noOfTrips : 1, noOfCashTrips: 0, noOfNonCashTrips: 0, trips: [], totalCashAmount:0, totalnonCashAmount: 0};
        curr.isCash ? acc[curr.driverID].noOfCashTrips = 1 : acc[curr.driverID].noOfNonCashTrips = 1;        
        acc[curr.driverID].trips.push({user: curr.user.name, createdAt: curr.user.created});
        acc[curr.driverID].totalAmountEarned = convertNum(curr.billedAmount);
        if(curr.isCash){
          acc[curr.driverID]["totalCashAmount"] = convertNum(curr.billedAmount);
        }else{
          acc[curr.driverID]["totalnonCashAmount"] = convertNum(curr.billedAmount);
        } 
      } else {
        ++acc[curr.driverID].noOfTrips;
        curr.isCash ? acc[curr.driverID].noOfCashTrips += 1 : acc[curr.driverID].noOfNonCashTrips += 1        
        acc[curr.driverID].trips.push({user: curr.user.name, createdAt: curr.user.created})
        acc[curr.driverID].totalAmountEarned += convertNum(curr.billedAmount)
        if(curr.isCash){
          acc[curr.driverID]["totalCashAmount"] += convertNum(curr.billedAmount); 
        }else{
          acc[curr.driverID]["totalnonCashAmount"] += convertNum(curr.billedAmount);
        } 
      
      }
      return acc;
    }, {});
    // console.log(allTrips)
    let uniqDriverID= Object.keys(allTrips)
    let noOfDrivers=[]
    uniqDriverID.forEach((value)=>{
     
        noOfDrivers.push(getDriver(driver));
        // console.log(noOfDrivers)
      })
      
    const drivers = await Promise.all(noOfDrivers.map(async val => {
        try{
          return await val
        }catch(e){
          return e
        }
      } ))
    
    // console.log(drivers)
  
  
  
  }

module.exports = driverReport;

// https://github.com/bendiumpope/driver-analysis