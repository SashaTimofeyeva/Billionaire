async function main() {
    console.log("Starting deployment...");

    const BillionairePari = await ethers.getContractFactory("BillionairePari");
    console.log("Contract factory created...");

    const pari = await BillionairePari.deploy();  // Direct deployment
    console.log("Contract deployment started...");

    await pari.deployed();
    console.log("Contract deployed to:", pari.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
