const { ethers, network, getNamedAccounts } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const { getWeth, AMOUNT } = require("./getWETH");
async function main() {
  const { deployer } = await getNamedAccounts();
  // AAVE protocol treats everything as ERC20 token
  // convert ETH - WETH(ERC20)
  let erc20Token;
  await getWeth();
  //get aaves's lending pool contract
  console.log("Getting lendingPool contract (Aave)");
  const lendingPool = await getLendingPool(deployer);
  console.log(`Lending Pool Address : ${lendingPool.address}`);
  // deposit to aave
  const wethContractAddress =
    networkConfig[network.config.chainId]["wethToken"];
  //lendingpool contract needs to have access to pull the determined amount(WETH) from our wallet

  //approve  (approving lendingPool contract(aave) to use AMOUNT units from our account)
  console.log("Approving LendingPool (Aave)");
  await approveErc20(
    wethContractAddress,
    lendingPool.address,
    AMOUNT,
    deployer
  );
  console.log("Depositing to Aave ..");
  // as our WETH  contract(Token) has 0.02 WETH in it and we have given permission to lendingPool to use 0.02 WETH it should use that and deposit that
  await lendingPool.deposit(wethContractAddress, AMOUNT, deployer, 0);
  console.log(
    `${(AMOUNT / 1e18).toString()} WETH Got successfully deposited to AAVE`
  );
  const FinalB = await erc20Token.balanceOf(deployer);
  console.log(
    `Your WETH Contract (Token) now has balace Of : ${(
      FinalB / 1e18
    ).toString()} WETH`
  );

  // lendingpooladdressprovider contract address -> 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
  // lendingpooladdressprovider contract ABI's at -> contracts/interfaces/IlendingPool
  async function getLendingPool(account) {
    const lendingPoolAddressProvider = await ethers.getContractAt(
      "ILendingPoolAddressesProvider",
      networkConfig[network.config.chainId]["lendingPoolAddressesProvider"],
      account
    );
    // get lendingpool contract address
    const lendingPoolAddresses =
      await lendingPoolAddressProvider.getLendingPool();
    // get lendingpool contract abi
    // lendingpooladdressprovider contract ABI's at -> contracts/interfaces/IlendingPool

    const lendingPool = await ethers.getContractAt(
      "ILendingPool",
      lendingPoolAddresses,
      account
    );
    console.log("Got lendingPool Contract");
    return lendingPool;
  }
  async function approveErc20(
    erc20address, //ERC20 contract address
    spenderAddress,
    amountToSpend,
    account // our account
  ) {
    erc20Token = await ethers.getContractAt(
      "IERC20", // this is contract interface/WETH contract interface
      erc20address,
      account
    );
    // we are approving spender with certain amount to use in behalf of us
    console.log("Approving spender ...");
    const tx = await erc20Token.approve(spenderAddress, amountToSpend);
    console.log("Spender Approoved!");
  }
}
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
