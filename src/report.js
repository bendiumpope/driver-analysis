const { getTrips, getDriver, getVehicle } = require('api');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */

 
/* THE TIME COMPLEXITY IS: O(n) time */
async function driverReport() {

  const trips = await getTrips();
  const drivers = Array.from(new Set(trips.reduce((acc, value) => {
    acc.push(value.driverID);
    return acc
  }, [])))

  const tripsArray = await tripsData(drivers, trips);
  const driversArray = await driversData(drivers, trips);

  return driversArray.map((driverDetail, index) => {
    if(driverDetail){
      return {...driverDetail, ...tripsArray[index]}
    }
  });
}

async function driversData(drivers) {

  let driversDetailsPromise = drivers.map((driver) => {
    return getDriver(driver)
      .then((data) => {
        // console.log(data.vehicleID.length)
        return {
          fullName: data.name,
          phone: data.phone,
          noOfVehicles: data.vehicleID.length,
          // vehicles: await vehicleArray
          
        }
      }).catch(() => 0);
  })
  
  return Promise.all(driversDetailsPromise).then()
}



async function tripsData(drivers, trips) {

  const driversTripsDetails = {}
  drivers.map((value) => {
    driversTripsDetails[value] = trips.filter((trip) => value == trip.driverID);
  });

  driversObject = [];

  drivers.map((driverID) => {
    const driver = driversTripsDetails[driverID].reduce((acc, value) => {
      acc.noOfTrips++;
      const amount = billedToInt(value.billedAmount);
      if (value.isCash === true) {
        acc.noOfCashTrips++;
        acc.totalCashAmount += amount;
      }
      if (value.isCash === false) {
        acc.noOfNonCashTrips++;
        acc.totalNonCashAmount += amount
      }
      acc.totalAmountEarned += amount;
      const trip = {};
      trip.user = value.user.name;
      trip.created = value.created;
      trip.pickup = value.pickup.address;
      trip.destination = value.destination.address;
      trip.billed = billedToInt(value.billedAmount);
      trip.isCash = value.isCash;

      acc.trips.push(trip);
      return acc;
    }, {
      noOfTrips: 0,
      noOfCashTrips: 0,
      noOfNonCashTrips: 0,
      totalAmountEarned: 0,
      totalCashAmount: 0,
      totalNonCashAmount: 0,
      trips: [],
    })
    driver.totalAmountEarned = Math.floor(driver.totalAmountEarned * 100) / 100;
    driver.totalCashAmount = Math.floor(driver.totalCashAmount * 100) / 100;
    driver.totalNonCashAmount = Math.floor(driver.totalNonCashAmount * 100) / 100;
    driversObject.push(driver);
  })

  return driversObject;
}

function billedToInt(billed) {
  
  let newBilled = parseFloat(billed.toString().replace(",", ""));

  return newBilled;
}

module.exports = driverReport;

// https://github.com/bendiumpope/driver-analysis

// console.log(driverReport());