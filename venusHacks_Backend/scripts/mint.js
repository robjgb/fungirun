const main = async () => {
    const Token = await (await ethers.getContractFactory("rewards")).attach("0x519A7a47f37074B046A989FEbf344c41D410813D")
  
    const token = await Token.distributeReward();
    // Wait for it to be mined.
    //await txn.wait()

  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  runMain();
  