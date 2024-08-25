
const { ethers } = require("hardhat");
const BillionaireArtefacts = require("../artifacts/contracts/billionaire.sol/Billionaire.json")

function strDtToUnixTs(val){
   const d = new Date(val);
   return Math.floor(d.getTime() / 1000);
}

function unixTsToDate(val){
    return new Date(val * 1000);
 }

async function addStreet(contract, account, price, openDateStr, openWLDateStr){
    const openDate = strDtToUnixTs(openDateStr);
    const openWLDate = strDtToUnixTs(openWLDateStr);
    let tx = await contract.connect(account).addStreet(price, openDate,openWLDate)
    await tx.wait()
}

async function addToWiteList(contract, account, userAddress, streetId){
    tx = await  contract.connect(account).addToWL(userAddress, streetId)
    await tx.wait()
}

// streets common information
async function showStreets(contract){
    const streetLength = await contract.getStreetsLength();
    for (let i=0; i<streetLength; i++){
       const street = await contract.streets(i)
       console.log("Street id:",i);
       console.log("    price (wei): ", street.price.toString()) ;
       console.log("    open time for everyone: ", unixTsToDate(street.openDate.toNumber()).toISOString()) ;
       console.log("    open time for white list: ", unixTsToDate(street.openWLDate.toNumber()).toISOString()) ;
      }
}


// user information
async function showUser(contract, userAddress){
    console.log("User:",userAddress);

    // get user id
    const userId = (await contract.getAccountInd(userAddress)).toNumber();   

     // check if in game
    if (userId === 0) {
       console.warn("   The address not added to game!!!");
       return;
    }
    console.log("    user id:", userId) ;
    
    // general user info
    const user =  await contract.accounts(userId);
    console.log("    referal user id:", user.parentRef) ;

    // user info for every street
    const streetLength = await contract.getStreetsLength();    
    for (let i=0; i<streetLength; i++){
       const accStreet = await contract.getAccStreet( i, userId)
       console.log("    Street id:",i);
       console.log("        purchased:", accStreet.hasStreet) ;
       console.log("        unlim:", accStreet.unlim) ;
       console.log("        steps: ", accStreet.steps) ;
    }
}

// purchase street. if parentId is empty - set it to 1
async function purchaseStreet(contract, account, streetId, parentId){
    const street = await contract.streets(streetId);
    let tx = await contract.connect(account).addAddressToStreet(streetId, parentId?parentId:1, {value: street.price.toString()});
    await tx.wait()
}

async function main(){
    

    [accContract, accDeveloper1] = await ethers.getSigners()
    const accAddress = "0x724E1aAC5E4772141a94ECE2711b3f11555Af2EC";
    const billionaire  = new ethers.Contract(accAddress,BillionaireArtefacts.abi,accContract);
    console.log(await billionaire.getAccountInd(accContract.address))
    console.log(await billionaire.getAccountInd(accDeveloper1.address))
    let streetLength = await billionaire.getStreetsLength();
    if (streetLength ==0){
        await addStreet(billionaire, accContract, "50000000000000000","2022-05-11T12:00:00Z","2022-05-11T11:00:00Z" )
        await addStreet(billionaire, accContract, "70000000000000000","2022-05-11T14:00:00Z","2022-05-11T13:00:00Z" )
        await addStreet(billionaire, accContract, "100000000000000000","2022-05-11T16:00:00Z","2022-05-11T15:00:00Z" )
        await addStreet(billionaire, accContract, "140000000000000000","2022-05-11T18:00:00Z","2022-05-11T17:00:00Z" )
        await addStreet(billionaire, accContract, "200000000000000000","2022-05-11T20:00:00Z","2022-05-11T19:00:00Z" )
        await addStreet(billionaire, accContract, "280000000000000000","2022-05-11T22:00:00Z","2022-05-11T21:00:00Z" )
        await addStreet(billionaire, accContract, "400000000000000000","2022-05-12T00:00:00Z","2022-05-11T23:00:00Z" )
        await addStreet(billionaire, accContract, "550000000000000000","2022-05-12T02:00:00Z","2022-05-12T01:00:00Z" )
        await addStreet(billionaire, accContract, "800000000000000000","2022-05-12T04:00:00Z","2022-05-12T03:00:00Z" )
        await addStreet(billionaire, accContract, "1100000000000000000","2022-05-12T06:00:00Z","2022-05-12T05:00:00Z" )
        await addStreet(billionaire, accContract, "1600000000000000000","2022-05-12T08:00:00Z","2022-05-12T07:00:00Z" )
        await addStreet(billionaire, accContract, "2200000000000000000","2022-05-12T10:00:00Z","2022-05-12T09:00:00Z" )
        await addStreet(billionaire, accContract, "3200000000000000000","2022-05-12T12:00:00Z","2022-05-12T11:00:00Z" )
        await addStreet(billionaire, accContract, "4400000000000000000","2022-05-12T14:00:00Z","2022-05-12T13:00:00Z" )
        await addStreet(billionaire, accContract, "6500000000000000000","2022-05-12T16:00:00Z","2022-05-12T15:00:00Z" )                                                  
    }
    
  //  await showStreets(billionaire);
   // await showUser(billionaire, accContract.address);
  //  await addToWiteList(billionaire, accContract, "0x49ad65c018cc8C7BeeDBA02910C17daB64FB3d82",1);
    await showUser(billionaire, "0x49ad65c018cc8C7BeeDBA02910C17daB64FB3d82");
    await purchaseStreet(billionaire, accDeveloper1, 1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });