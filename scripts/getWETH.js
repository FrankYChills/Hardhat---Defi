const { getNamedAccounts, ethers } = require("hardhat");

const AMOUNT = ethers.utils.parseEther("0.02");
async function getWeth() {
  const { deployer } = await getNamedAccounts();
  // call deposit function on WETH contract(deployed on mainnet)
  // to get that contract -> ABI + contract address [ABI - IWETH interface and ]
  //0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
  console.log("Finding WETH Contract ..");
  const iWeth = await ethers.getContractAt(
    "IWeth",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    deployer
  );
  console.log("Contract Found. Depositing ETH to Contract");
  const tx = await iWeth.deposit({ value: AMOUNT });
  await tx.wait(1);
  console.log("Funds Deposited.Getting Balance from Contract");
  const wethBalance = await iWeth.balanceOf(deployer);
  console.log(
    `The WETH balance of ${deployer} is ${wethBalance.toString()} units or ${(
      wethBalance / 1e18
    ).toString()} WETH`
  );
}

module.exports = { getWeth };
