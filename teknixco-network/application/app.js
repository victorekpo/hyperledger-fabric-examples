const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const main = async () => {
    const ccpPath = path.resolve(__dirname, '..', 'connection.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'Admin',
        discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork('teknixcochannel');
    const contract = network.getContract('teknixco');

    await contract.submitTransaction('createAsset', '1', 'SampleValue');
    console.log('Transaction has been submitted');

    const result = await contract.evaluateTransaction('readAsset', '1');
    console.log(`Transaction result: ${result.toString()}`);

    await gateway.disconnect();
};

main().catch((error) => {
    console.error(`Failed to run application: ${error}`);
});
