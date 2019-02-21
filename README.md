## Running Unit Tests:

1.	Open the project folder in Visual Studio Code.
2.	Open the terminal via right-click on project's folder -> “Open in Terminal”;
3.	Sync all packages via “npm install” command inside the terminal;
4.	Run “cd truffle” command;
5.	To perform tests run “truffle develop” (wait while Truffle sets up the testnet) and “test” commands.

## Deployment:

For deploying the Token contract into the Ropsten testnet:
1.	Install MetaMask wallet https://metamask.io
2.	Choose “Ropsten Test Network” and create a wallet;
3.	Go to “Buy” -> “Ropsten Test Faucet” and get some Ropsten ETH for your wallet;
4.	Add your wallet’s private key from MetaMask to the “private-key-ropsten.txt” file in the "truffle" folder;
5.	Replace the "YOUR INFURA API KEY" string in "truffle-config.js" file in the "truffle" folder with your actual Ropsten API key from https://infura.io;
6.	Open the “truffle” folder in terminal (described in "Running Unit Tests" section);
7.	Run “truffle migrate --network ropsten” command – you’ll get the address of your newly deployed contracts inside the terminal.
