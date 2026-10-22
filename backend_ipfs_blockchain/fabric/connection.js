
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
        const isRender = Boolean(process.env.RENDER);

        const peerEndpoint =
            process.env.FABRIC_PEER_ENDPOINT ||
            (isRender ? "127.0.0.1:7051" : "127.0.0.1:7051");

        const peerHostAlias =
            process.env.FABRIC_PEER_HOST_ALIAS ||
            "peer0.org1.example.com";

        let certPath;
        let keyPath;
        let tlsCertPath;

        if (isRender) {
            certPath =
                process.env.FABRIC_CLIENT_CERT_PATH ||
                "/etc/secrets/fabric-client-cert.pem";

            keyPath =
                process.env.FABRIC_CLIENT_KEY_PATH ||
                "/etc/secrets/fabric-client-key.pem";

            tlsCertPath =
                process.env.FABRIC_TLS_CA_PATH ||
                "/etc/secrets/fabric-peer-tls-ca.pem";
        } else {
            const cryptoPath =
                process.env.FABRIC_CRYPTO_PATH ||
                "\\\\wsl$\\Ubuntu\\home\\usharani\\fabric-samples\\test-network\\organizations\\peerOrganizations\\org1.example.com";

            certPath = path.join(
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

            if (!fs.existsSync(keyDirectory)) {
                throw new Error(
                    `Fabric keystore directory not found: ${keyDirectory}`
                );
            }

            const keyFileName = fs.readdirSync(keyDirectory).find(
                (name) => name.endsWith("_sk") || name.endsWith(".pem")
            );

            if (!keyFileName) {
                throw new Error(`No private key found in: ${keyDirectory}`);
            }

            keyPath = path.join(keyDirectory, keyFileName);

            tlsCertPath = path.join(
                cryptoPath,
                "peers",
                "peer0.org1.example.com",
                "tls",
                "ca.crt"
            );
        }

        for (const [label, filePath] of [
            ["Fabric client certificate", certPath],
            ["Fabric client private key", keyPath],
            ["Fabric TLS CA certificate", tlsCertPath],
        ]) {
            if (!fs.existsSync(filePath)) {
                throw new Error(`${label} not found at ${filePath}`);
            }
        }

        const certificate = fs.readFileSync(certPath);
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
            credentials: certificate,
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
