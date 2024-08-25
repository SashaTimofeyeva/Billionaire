//0x9693107Fd03baD77F9977138B44096fC18038246 

const { ethers } = require("hardhat");
const BillionaireArtefacts = require("../artifacts/contracts/BillionairePari.sol/BillionairePari.json")



async function main(){
    

    [accContract, accDeveloper1] = await ethers.getSigners()
    const accAddress = "0x9693107Fd03baD77F9977138B44096fC18038246";
    const billionaire  = new ethers.Contract(accAddress,BillionaireArtefacts.abi,accContract);

    let bidCount = await billionaire.getBidsCount();

    if (bidCount==0){

    let tx = await billionaire.addBid("100000000000000000", "10000000000000000") 
    await tx.wait()
    
    tx = await billionaire.addBid("250000000000000000", "20000000000000000") 
    await tx.wait()

    tx = await billionaire.addBid("400000000000000000", "30000000000000000") 
    await tx.wait()

    tx = await billionaire.changeBid(2,"400000000000000000", "30000000000000000", false) 
    await tx.wait()

    }
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });