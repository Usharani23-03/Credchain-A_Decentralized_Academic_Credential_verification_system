const {
    connect,
    signers,
} = require("@hyperledger/fabric-gateway");

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const grpc = require("@grpc/grpc-js");

const connectToFabric = async () => {
    try {
        const cryptoPath =
            "\\\\wsl$\\Ubuntu\\home\\usharani\\fabric-samples\\test-network\\organizations\\peerOrganizations\\org1.example.com";

        const certPath = path.join(
            cryptoPath,
            "users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem"
        );

        const keyPath = path.join(
            cryptoPath,
            "users/Admin@org1.example.com/msp/keystore/priv_sk"
        );

        const tlsCertPath = path.join(
            cryptoPath,
            "peers/peer0.org1.example.com/tls/ca.crt"
        );

        if (!fs.existsSync(certPath)) {
            throw new Error(`Fabric certificate not found: ${certPath}`);
        }

        if (!fs.existsSync(keyPath)) {
            throw new Error(`Fabric private key not found: ${keyPath}`);
        }

        if (!fs.existsSync(tlsCertPath)) {
            throw new Error(`Fabric TLS certificate not found: ${tlsCertPath}`);
        }

        const certificate = fs.readFileSync(certPath, "utf8");
        const privateKey = fs.readFileSync(keyPath, "utf8");
        const tlsCert = fs.readFileSync(tlsCertPath);

        console.log("Fabric certificate loaded");
        console.log("Fabric private key loaded");

        const grpcClient = new grpc.Client(
            "127.0.0.1:7051",
            grpc.credentials.createSsl(tlsCert),
            {
                "grpc.ssl_target_name_override": "peer0.org1.example.com",
                "grpc.default_authority": "peer0.org1.example.com",
            }
        );

        const identity = {
            mspId: "Org1MSP",
            credentials: Buffer.from(certificate),
        };

        const privateKeyObject = crypto.createPrivateKey(privateKey);

        const signer = signers.newPrivateKeySigner(privateKeyObject);

        const gateway = connect({
            client: grpcClient,
            identity,
            signer,
        });

        console.log("Fabric Gateway Connected");

        const network = gateway.getNetwork("mychannel");

        console.log("Fabric network loaded");

        const contract = network.getContract("certificate");

        console.log("Fabric contract loaded");

        return contract;

    } catch (error) {
        console.error("FABRIC CONNECTION ERROR");
        console.error(error);
        throw error;
    }
};

module.exports = connectToFabric;