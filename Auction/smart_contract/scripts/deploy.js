async function main() {
  const Auction = await ethers.getContractFactory("Auctions");
  const auction = await Auction.deploy();
  await auction.deployed();

  console.log("Auction deployed to:", auction.address);
}
//0x7CE4E062Bc45617E504f592bb4eAed8f96de9E19
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit = 1;
  });
