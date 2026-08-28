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

    try {

        const cryptoPath =
            "\\\\wsl$\\Ubuntu\\home\\keerthana\\fabric-samples\\test-network\\organizations\\peerOrganizations\\org1.example.com";


        // ============================================================
        // ADMIN CERTIFICATE
        // ============================================================

        const certPath = path.join(
            cryptoPath,
            "users/Admin@org1.example.com/msp/signcerts"
        );

        const certFiles = fs.readdirSync(certPath);

        if (certFiles.length === 0) {
            throw new Error(
                "No Admin certificate found in: " + certPath
            );
        }

        const credentials = fs.readFileSync(
            path.join(certPath, certFiles[0])
        );

        console.log("Certificate loaded");


        // ============================================================
        // ADMIN PRIVATE KEY
        // ============================================================

        const keyPath = path.join(
            cryptoPath,
            "users/Admin@org1.example.com/msp/keystore"
        );

        const keyFiles = fs.readdirSync(keyPath);

        if (keyFiles.length === 0) {
            throw new Error(
                "No private key found in: " + keyPath
            );
        }

        const privateKeyPem = fs.readFileSync(
            path.join(keyPath, keyFiles[0]),
            "utf8"
        );

        const privateKey = crypto.createPrivateKey({
            key: privateKeyPem,
            format: "pem"
        });

        console.log("Private key loaded");


        // ============================================================
        // ORG1 PEER TLS CERTIFICATE
        // ============================================================

        const org1TlsCertPath = path.join(
            cryptoPath,
            "peers/peer0.org1.example.com/tls/ca.crt"
        );

        const org1TlsCertificate =
            fs.readFileSync(org1TlsCertPath);

        console.log(
            "Org1 TLS certificate loaded"
        );


        // ============================================================
        // ORG1 GRPC CLIENT
        // ============================================================

        const org1Client = new grpc.Client(
            "localhost:7051",
            grpc.credentials.createSsl(
                org1TlsCertificate
            ),
            {
                "grpc.ssl_target_name_override":
                    "peer0.org1.example.com"
            }
        );

        console.log(
            "Org1 gRPC client created"
        );


        // ============================================================
        // FABRIC GATEWAY
        // ============================================================

        const gateway = connect({
            client: org1Client,

            identity: {
                mspId: "Org1MSP",
                credentials
            },

            signer: signers.newPrivateKeySigner(
                privateKey
            )
        });

        console.log(
            "Fabric Gateway connected"
        );


        // ============================================================
        // NETWORK
        // ============================================================

        const network =
            gateway.getNetwork(channelName);

        const contract =
            network.getContract(chaincodeName);

        console.log(
            `Fabric contract loaded: ${chaincodeName}`
        );


        return contract;

    } catch (error) {

        console.error("");
        console.error(
            "================================="
        );
        console.error(
            "FABRIC CONNECTION ERROR"
        );
        console.error(
            "================================="
        );

        console.error(error.message);

        console.error(
            "================================="
        );

        throw error;
    }
}

module.exports = connectFabric;