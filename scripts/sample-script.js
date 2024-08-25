
const { ethers } = require("hardhat");
const BillionaireArtefacts = require("../artifacts/contracts/billionaire.sol/Billionaire.json")


// convert street open date to js date
function unixTsToDate(val){
    return new Date(val * 1000);
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

    await showStreets(billionaire);
    await showUser(billionaire, "0x49ad65c018cc8C7BeeDBA02910C17daB64FB3d82");
    await purchaseStreet(billionaire, accDeveloper1, 1);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });