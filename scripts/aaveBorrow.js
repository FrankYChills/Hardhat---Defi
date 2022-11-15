const { getWeth } = require("./getWETH");
async function main() {
  // AAVE protocol treats everything as ERC20 token
  // convert ETH - WETH(ERC20)
  await getWeth();
}
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
