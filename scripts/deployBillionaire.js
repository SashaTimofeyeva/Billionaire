async function main() {
    const Billionaire = await ethers.getContractFactory("Billionaire");
    const billionaire = await Billionaire.deploy();  // Direct deployment
    await billionaire.deployed();

    console.log("Billionaire contract deployed to:", billionaire.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

