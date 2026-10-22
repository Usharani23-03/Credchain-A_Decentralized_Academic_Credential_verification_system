
const {
    connect,
    signers,
} = require("@hyperledger/fabric-gateway");

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const grpc = require("@grpc/grpc-js");

const connectToFabric = async () => {
    let grpcClient;

    try {
        const cryptoPath =
            process.env.FABRIC_CRYPTO_PATH ||
            "\\\\wsl$\\Ubuntu\\home\\usharani\\fabric-samples\\test-network\\organizations\\peerOrganizations\\org1.example.com";

        const peerEndpoint =
            process.env.FABRIC_PEER_ENDPOINT || "127.0.0.1:7051";

        const peerHostAlias =
            process.env.FABRIC_PEER_HOST_ALIAS || "peer0.org1.example.com";

        const certPath = path.join(
            cryptoPath,
            "users",
            "Admin@org1.example.com",
            "msp",
            "signcerts",
            "Admin@org1.example.com-cert.pem"
        );

        const keyDirectory = path.join(
            cryptoPath,
            "users",
            "Admin@org1.example.com",
            "msp",
            "keystore"
        );

        const tlsCertPath = path.join(
            cryptoPath,
            "peers",
            "peer0.org1.example.com",
            "tls",
            "ca.crt"
        );

        if (!fs.existsSync(certPath)) {
            throw new Error(`Fabric certificate not found: ${certPath}`);
        }

        if (!fs.existsSync(keyDirectory)) {
            throw new Error(`Fabric keystore directory not found: ${keyDirectory}`);
        }

        const keyFileName = fs.readdirSync(keyDirectory).find(
            (name) => name.endsWith("_sk") || name.endsWith(".pem")
        );

        if (!keyFileName) {
            throw new Error(`No private key found in: ${keyDirectory}`);
        }

        const keyPath = path.join(keyDirectory, keyFileName);

        if (!fs.existsSync(tlsCertPath)) {
            throw new Error(`Fabric TLS certificate not found: ${tlsCertPath}`);
        }

        const certificate = fs.readFileSync(certPath, "utf8");
        const privateKey = fs.readFileSync(keyPath, "utf8");
        const tlsCert = fs.readFileSync(tlsCertPath);

        const grpcCredentials = grpc.credentials.createSsl(tlsCert);

        grpcClient = new grpc.Client(
            peerEndpoint,
            grpcCredentials,
            {
                "grpc.ssl_target_name_override": peerHostAlias,
                "grpc.default_authority": peerHostAlias,
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

        const network = gateway.getNetwork("mychannel");
        const contract = network.getContract("certificate");

        console.log("Fabric Gateway configured");
        console.log(`Fabric peer endpoint: ${peerEndpoint}`);

        return contract;
    } catch (error) {
        if (grpcClient) {
            grpcClient.close();
        }

        console.error("FABRIC CONNECTION ERROR:", error.message);
        throw error;
    }
};

module.exports = connectToFabric;
