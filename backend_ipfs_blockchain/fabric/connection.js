const grpc = require("@grpc/grpc-js");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const {
    connect,
    signers
} = require("@hyperledger/fabric-gateway");


const channelName = "mychannel";
const chaincodeName = "certificate";


async function connectFabric() {

    const cryptoPath =
        "\\\\wsl$\\Ubuntu\\home\\usharani\\fabric-samples\\test-network\\organizations\\peerOrganizations\\org1.example.com";


    try {

        // Load certificate

        const certPath = path.join(
            cryptoPath,
            "users/Admin@org1.example.com/msp/signcerts"
        );


        const certFile = fs.readdirSync(certPath)[0];


        const credentials = fs.readFileSync(
            path.join(certPath, certFile)
        );


        // Load private key

        const keyPath = path.join(
            cryptoPath,
            "users/Admin@org1.example.com/msp/keystore"
        );


        const keyFile = fs.readdirSync(keyPath)[0];


        const privateKeyPem = fs.readFileSync(
            path.join(keyPath, keyFile),
            "utf8"
        );


        const privateKey = crypto.createPrivateKey({
            key: privateKeyPem,
            format: "pem"
        });


        console.log("Certificate loaded");
        console.log("Private key loaded");


        // Connect to Fabric peer

        const client = new grpc.Client(
            "localhost:7051",
            grpc.credentials.createSsl(
                fs.readFileSync(
                    path.join(
                        cryptoPath,
                        "peers/peer0.org1.example.com/tls/ca.crt"
                    )
                )
            )
        );


        const gateway = connect({

            client,

            identity: {
                mspId: "Org1MSP",
                credentials
            },

            signer: signers.newPrivateKeySigner(privateKey)

        });


        const network = gateway.getNetwork(channelName);


        const contract = network.getContract(chaincodeName);


        console.log("Fabric Gateway Connected");


        return contract;


    } catch(error) {

        console.error("Fabric connection error:");
        throw error;

    }

}

module.exports = connectFabric;

