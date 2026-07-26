const { Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

async function main() {

    const walletPath = path.join(
        __dirname,
        "blockchain",
        "wallet"
    );

    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const certPath = path.join(
        walletPath,
        "User1@org2.example.com",
        "signcerts",
        "cert.pem"
    );

    const keyDir = path.join(
        walletPath,
        "User1@org2.example.com",
        "keystore"
    );

    const keyFile = fs.readdirSync(keyDir)[0];

    const keyPath = path.join(
        keyDir,
        keyFile
    );

    const certificate = fs.readFileSync(
        certPath,
        "utf8"
    );

    const privateKey = fs.readFileSync(
        keyPath,
        "utf8"
    );

    const identity = {
        credentials: {
            certificate,
            privateKey
        },
        mspId: "Org2MSP",
        type: "X.509"
    };

    await wallet.put(
        "User1@org2.example.com",
        identity
    );

    console.log("Identity imported successfully ✅");
}

main();