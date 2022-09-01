async function main () {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying the contract with account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Accont Balance: ${balance.toString()}`);

  const Token = await ethers.getContractFactory('Pandacoin');
  const token = await Token.deploy();
  console.log(`Token Address : ${token.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });