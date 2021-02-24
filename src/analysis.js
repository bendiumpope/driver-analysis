const { getTrips, getDriver } = require('api');

/**
 * This function should return the trip data analysis
 *
 * @returns {any} Trip data analysis
 */

async function analysis() {
  
    let getTrip = await getTrips();
    // console.log(getTrip)
    // getTrip.then(console.log)
  
    let cashTrip = getTrip.filter((value)=>{
  
      if(value['isCash']===true){
  
        return value;
      }
    })
    // console.log(cashTrip.length)
    const noOfCashTrip=cashTrip.length;
  
    let nonCashTrip = getTrip.filter((value)=>{
  
      if(value['isCash']===false){
  
        return value;
      }
    })
    const noOfNonCashTrip= nonCashTrip.length;
  
    billedTotal = getTrip.reduce(((acc,value)=>{
      
      if(typeof value['billedAmount']!== "number"){
        value1=value['billedAmount'].replace(",","")
        values=parseFloat(value1)
      }else{
        values=value['billedAmount']
      }
      return acc+values;
    }),0.0)
    billedTotal=parseFloat(billedTotal.toFixed(2))
    // console.log(billedTotal)
  
    cashBilledTotal = cashTrip.reduce(((acc,value)=>{
      
      if(typeof value['billedAmount']!== "number"){
        value1=value['billedAmount'].replace(",","")
        values=parseFloat(value1)
      }else{
        values=value['billedAmount']
      }
      return acc+values;
    }),0.0)
  
    // console.log(cashBilledTotal)
  
    nonCashBilledTotal = nonCashTrip.reduce(((acc,value)=>{
      
      if(typeof value['billedAmount']!== "number"){
        value1=value['billedAmount'].replace(",","")
        values=parseFloat(value1)
      }else{
        values=value['billedAmount']
      }
      return acc+values;
    }),0.0)
    // console.log(nonCashBilledTotal)
    nonCashBilledTotal=parseFloat(nonCashBilledTotal.toFixed(2))
    // console.log(nonCashBilledTotal)
       
    let getDriversID = getTrip.reduce((acc,value)=>{
  
      if(!(acc.includes(value['driverID']))){
        acc.push(value['driverID'])
      }
  
      return acc;
        
    },[]) 
  
    // console.log(getDriversID)
  
  
    let noOfDrivers = [];
  
    getDriversID.forEach((driver)=>{
  
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
  drivers.pop()
  
  const noOfDriversWithMoreThanOneVehicle = drivers.reduce(((acc,value)=>{
    if(value["vehicleID"].length >1){
      acc++
    }
  
    return acc;
  
  }),0)
  
  // console.log(noOfDriversWithMoreThanOneVehicle)
  
  let allDriversID=[]
    getTrip.map((value)=>{
      // console.log(value)
      allDriversID.push(value["driverID"])    
    }) 
    // console.log(allDriversID)
  
    let mostTripKey={};  
    let totalCash ={};
    let mostTrip = allDriversID.reduce(((acc,value)=>{
  
      if(!(acc.hasOwnProperty(value))){
            acc[value]=1;
  
      }else{
        acc[value]+=1;
      }
  
      return acc;
    }),mostTripKey);
  
    // console.log(mostTrip)
    let valuez=0;
    for(keys in mostTrip){
  
      if(mostTrip[keys]>valuez){
        valuez=mostTrip[keys];
      } 
    }
    // console.log(valuez)
    const mostDriverId = Object.keys(mostTrip).find(key => mostTrip[key] === valuez);
    
   let MostDriverDetails = await getDriver(mostDriverId);
  
  totalAmountEarned=getTrip.reduce(((acc,value)=>{
  
        if(value.driverID===mostDriverId){
  // console.log(value.billedAmount)
  
    if(typeof value['billedAmount']!== "number"){
      acc +=parseFloat((value["billedAmount"]).replace(',',""));
    }else{
      acc += (value["billedAmount"]);
    } 
        }
  
        return acc;
      }),0)
      // console.log(totalAmountEarned)
      // console.log(MostDriverDetails)
  
      let mostTripsByDriverDetails={}
      mostTripsByDriverDetails['name']=MostDriverDetails['name']
      mostTripsByDriverDetails['email']=MostDriverDetails['email']
      mostTripsByDriverDetails['phone']=MostDriverDetails['phone']
      mostTripsByDriverDetails['noOfTrips']=valuez
      mostTripsByDriverDetails['totalAmountEarned']=totalAmountEarned
  
      // console.log(mostTripsByDriverDetails)
      
      let highestAmount=getTrip.reduce((acc,value)=>{
        let hold=0;
        if(typeof value["billedAmount"]!=='number'){
          hold= parseFloat((value["billedAmount"]).replace(',',""));
        }else{
          hold=value["billedAmount"];
        }
  
        if(!(acc.hasOwnProperty(value.driverID))){
  
          acc[value.driverID] = hold;
        }else{
          acc[value.driverID] += hold;
        }
  
        return acc;
      },{});
  
      // console.log(highestAmount)
  
    highestPaid=getDriversID.reduce(((acc,value)=>{
  
      if(highestAmount[value]>acc){
        acc = highestAmount[value];
      }
      return acc;
    }),0)
  
    // console.log(highestPaid);
  
    const mostPaidKey = Object.keys(highestAmount).find(key => highestAmount[key] === highestPaid);
    // console.log( mostPaidKey);
  
    let mostPaidDriver = await getDriver(mostPaidKey);
    let mostpaidDriverDetails={}
    mostpaidDriverDetails['name']= mostPaidDriver['name']
    mostpaidDriverDetails['email']= mostPaidDriver['email']
    mostpaidDriverDetails['phone']= mostPaidDriver['phone']
    mostpaidDriverDetails['noOfTrips']=valuez
    mostpaidDriverDetails['totalAmountEarned']=highestPaid;
  
    // console.log(mostpaidDriverDetails)
  
    return{
        noOfCashTrips: noOfCashTrip,
        noOfNonCashTrips: noOfNonCashTrip,
        billedTotal: billedTotal,
        cashBilledTotal: cashBilledTotal,
        nonCashBilledTotal: nonCashBilledTotal,
        noOfDriversWithMoreThanOneVehicle:noOfDriversWithMoreThanOneVehicle,
        mostTripsByDriver:mostTripsByDriverDetails,
        highestEarningDriver: mostpaidDriverDetails
    
    }
}

module.exports = analysis;
