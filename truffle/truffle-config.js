const HDWalletProvider = require("truffle-hdwallet-provider");
const infuraAPIKey = "YOUR INFURA API KEY";

const fs = require('fs');
const rosptenWalletPrivateKey = fs.readFileSync("private-key-ropsten.txt").toString().trim();

module.exports = {
  networks: {
    ropsten: {
      provider: () => new HDWalletProvider(rosptenWalletPrivateKey, `https://ropsten.infura.io/v3/${infuraAPIKey}`),
      network_id: 3,
      gas: 5500000,
      gasPrice: 1100000000,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.5.3",
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: "byzantium"
      }
    }
  }
}
