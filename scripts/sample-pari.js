//0x9693107Fd03baD77F9977138B44096fC18038246 

const { ethers } = require("hardhat");
const BillionaireArtefacts = require("../artifacts/contracts/BillionairePari.sol/BillionairePari.json")

// show bid info
async function showBid(contract, ind){
  const bid = await contract.getBid(ind);
  console.log("BID:", ind);
  console.log(" enabled:",bid.enabled);
  console.log(" bid value:",bid.val);
  console.log(" commission:",bid.commission);
  console.log(" waiting address :",bid.openAdr);
}

// withdraw
async function withdraw(contract, account, ind){
    console.log(account.address, "withdraw a bid (index):", ind);
    tx = await contract.connect(account).withdraw(ind);
    await tx.wait()

}


// set bid
async function setBid(contract, account, ind){
    console.log(account.address, "set a bid (index):", ind);
    const bid = await contract.getBid(ind);

    // sum for pay
    const val = bid.val.add(bid.commission);

    tx = await contract.connect(account).setBid(ind,{value: val.toString()});
    let receipt = await tx.wait()

    if (!receipt.events.length){
        console.log(account.address," are first bidder!")
    } else {
        let winEvent = receipt.events.filter(z => z.event == "WinEvent")[0].args;
        let loseEvent = receipt.events.filter(z => z.event == "LoseEvent")[0].args;
        
        console.log("Winner", winEvent.adr);
        console.log("Loser", loseEvent.adr);

        if (winEvent.adr == account.address){
            console.log("You are winner! Sum:", winEvent.sum);
        } else 
        {
            console.log("You are loser! Bid index:", loseEvent.ind);
        }
        
    }
   }


async function main(){
    [accContract, accDeveloper1] = await ethers.getSigners()
    const accAddress = "0x9693107Fd03baD77F9977138B44096fC18038246";
    const billionaire  = new ethers.Contract(accAddress,BillionaireArtefacts.abi,accContract);

    // bids count
    let bidCount = await billionaire.connect(accDeveloper1).getBidsCount();

    // set and withdraw test
    await setBid(billionaire, accDeveloper1,0 );
    await withdraw(billionaire, accDeveloper1, 0);

    for (let i=0; i<bidCount; i++){
        await showBid(billionaire, i);

        //  set bid with result test
        const bid = await billionaire.getBid(i);
        if (bid.enabled){
            await setBid(billionaire, accDeveloper1,i );
            await setBid(billionaire, accContract,i );           
        }   
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });