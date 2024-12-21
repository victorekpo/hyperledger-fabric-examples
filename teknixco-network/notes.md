## Installations
Dependencies to Install
- Global:
  - Docker
  - Fabric binaries and images (curl -sSL https://bit.ly/2ysbOFE | bash -s)
- Chaincode:
  - fabric-contract-api
- Application:
  - fabric-network

## Docker-compose.yml
#### Key Features
- Orderer: Central entity responsible for consensus and ordering transactions.
Uses the genesis.block and OrdererMSP for configuration.
- Peer: Maintains the ledger and chaincode execution.
Configured for Org1 with Org1MSP.
- CA (Certificate Authority): Issues identities for users, peers, and orderers in the network.
- CLI: A tool container to manage the network (e.g., create channels, install chaincode, invoke transactions).

#### How to Use
1. Start the network: docker-compose up -d
2. Generate crypto materials and artifacts: Make sure you have crypto-config.yaml and configtx.yaml prepared. Use the Fabric binaries to generate artifacts:
   - ./cryptogen generate --config=crypto-config.yaml
   - ./configtxgen -profile TeknixcoChannel -outputBlock ./channel-artifacts/genes
3. Access the CLI: docker exec -it cli bash

## configtx.yaml
1. Define docker-compose.yml and configure your genesis block and channel configtx.yaml
2. Generate artifacts:
./bin/configtxgen -profile TeknixcoChannel -outputBlock genesis.block
./bin/cryptogen generate --config=crypto-config.yaml
3. Start the network
docker-compose up -d

## Test Locally
1. Package and install the chaincode:
   - peer lifecycle chaincode package teknixco.tar.gz --path ./chaincode/teknixco --lang node --label teknixco_1
2. Approve and commit the chaincode:
   - peer lifecycle chaincode approveformyorg ...
   - peer lifecycle chaincode commit ...
3. Start the application 
   - node app.js

Here are the full commands to approve and commit a chaincode in Hyperledger Fabric, assuming you're deploying the teknixco chaincode:
- Ensure the following are ready:
  1. The chaincode package (teknixco.tar.gz) has been created using:
     - peer lifecycle chaincode package teknixco.tar.gz --path ./chaincode/teknixco --lang node --label teknixco_1
  2. The chaincode package is installed on all peers using:
     - peer lifecycle chaincode install teknixco.tar.gz
     - This will output a package ID (e.g., teknixco_1:<hash>), which will be used in the approval step.

1. Approve the Chaincode for Your Organization
Replace placeholders (<...>) with your actual values:
peer lifecycle chaincode approveformyorg \
--channelID teknixcochannel \
--name teknixco \
--version 1.0 \
--package-id teknixco_1:<hash> \
--sequence 1 \
--orderer orderer.teknixco.com:7050 \
--ordererTLSHostnameOverride orderer.teknixco.com \
--tls --cafile /path/to/orderer/ca-cert.pem

--channelID: The name of your channel (e.g., teknixcochannel).
--name: The name of your chaincode (e.g., teknixco).
--version: Chaincode version (e.g., 1.0).
--package-id: Obtained from the installation step.
--sequence: Sequence number (increment for subsequent upgrades).
--tls --cafile: Required if TLS is enabled.
2. Check Approval Status
   To verify if all required organizations have approved:
   peer lifecycle chaincode checkcommitreadiness \
   --channelID teknixcochannel \
   --name teknixco \
   --version 1.0 \
   --sequence 1 \
   --output json \
   --tls --cafile /path/to/orderer/ca-cert.pem
   This will list the organizations that have approved the chaincode definition.

3. Commit the Chaincode
   Once all required organizations have approved, commit the chaincode:
   peer lifecycle chaincode commit \
   --channelID teknixcochannel \
   --name teknixco \
   --version 1.0 \
   --sequence 1 \
   --orderer orderer.teknixco.com:7050 \
   --ordererTLSHostnameOverride orderer.teknixco.com \
   --tls --cafile /path/to/orderer/ca-cert.pem \
   --peerAddresses peer0.org1.teknixco.com:7051 \
   --tlsRootCertFiles /path/to/org1/peer0/ca-cert.pem
--peerAddresses: Add all peers participating in the chaincode definition.
--tlsRootCertFiles: Path to the TLS certificate of the corresponding peer.

4. Query Committed Chaincode
   Verify the chaincode is successfully committed:

peer lifecycle chaincode querycommitted \
--channelID teknixcochannel \
--name teknixco \
--tls --cafile /path/to/orderer/ca-cert.pem

Example
Let’s say:
Channel: teknixcochannel
Chaincode name: teknixco
Peer: peer0.org1.teknixco.com
Package ID: teknixco_1:abcdef123456
Orderer CA: /path/to/orderer/ca-cert.pem

Approval Command:
peer lifecycle chaincode approveformyorg \
--channelID teknixcochannel \
--name teknixco \
--version 1.0 \
--package-id teknixco_1:abcdef123456 \
--sequence 1 \
--orderer orderer.teknixco.com:7050 \
--ordererTLSHostnameOverride orderer.teknixco.com \
--tls --cafile /path/to/orderer/ca-cert.pem

Commit Command:
peer lifecycle chaincode commit \
--channelID teknixcochannel \
--name teknixco \
--version 1.0 \
--sequence 1 \
--orderer orderer.teknixco.com:7050 \
--ordererTLSHostnameOverride orderer.teknixco.com \
--tls --cafile /path/to/orderer/ca-cert.pem \
--peerAddresses peer0.org1.teknixco.com:7051 \
--tlsRootCertFiles /path/to/org1/peer0/ca-cert.pem
