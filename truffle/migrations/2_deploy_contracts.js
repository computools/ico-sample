const ERC223 = artifacts.require("ERC223.sol");
const Crowdsale = artifacts.require("Crowdsale.sol");

const TOKEN_NAME = "TOKEN";
const TOKEN_SYMBOL = "TKN";

const DECIMALS = "000000000000000000";
const TOTAL_SUPPLY = "100000000" + DECIMALS;
const CROWDSALE_BALANCE = "100000000" + DECIMALS;

module.exports = async deployer => {
  return deployer.deploy(ERC223, 
                        TOKEN_NAME, 
                        TOKEN_SYMBOL, 
                        TOTAL_SUPPLY, 
                        ).then((ERC223Instance) => { 
    console.log('***** DEPLOYED ***** ERC223 at address: ', ERC223Instance.address);
   
    return deployer.deploy(Crowdsale, ERC223Instance.address).then((CrowdsaleInstance) => { 
      console.log('***** DEPLOYED ***** Crowdsale at address: ', CrowdsaleInstance.address);
    
      ERC223Instance.setCrowdsale(CrowdsaleInstance.address, CROWDSALE_BALANCE);
      CrowdsaleInstance.startCrowdsale(web3.utils.toWei("10", 'ether'));
    });

  });
};
