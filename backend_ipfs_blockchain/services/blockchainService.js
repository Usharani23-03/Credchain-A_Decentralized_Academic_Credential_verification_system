const connectFabric = require("../fabric/connection");

// ============================================================
// Store Certificate on Hyperledger Fabric
// ============================================================

exports.storeHashOnBlockchain = async (
    fileHash,
    certificateId,
    studentName = "Unknown",
    registerNo = "Unknown",
    degree = "Certificate",
    issuer = "Unknown",
    ipfsCID = ""
) => {

    try {

        if (!fileHash) {
            throw new Error("File hash is required.");
        }

        if (!certificateId) {
            throw new Error("Certificate ID is required.");
        }

        const contract = await connectFabric();

        console.log("");
        console.log("=================================");
        console.log("BLOCKCHAIN: CREATE CERTIFICATE");
        console.log("=================================");
        console.log("Certificate ID:", certificateId);
        console.log("Student:", studentName);
        console.log("Register No:", registerNo);
        console.log("Degree:", degree);
        console.log("Issuer:", issuer);
        console.log("SHA-512:", fileHash);
        console.log("IPFS CID:", ipfsCID);
        console.log("=================================");

        // Create certificate on Hyperledger Fabric
        const result = await contract.submitTransaction(
            "CreateCertificate",
            certificateId,
            studentName,
            registerNo,
            degree,
            issuer,
            fileHash,
            ipfsCID
        );

        // Fabric Gateway returns a Uint8Array.
        // Convert it explicitly to a Node.js Buffer.
        const rawResponse =
            Buffer.from(result).toString("utf8").trim();

        let chaincodeResponse = null;

        try {
            chaincodeResponse = JSON.parse(rawResponse);
        } catch {
            chaincodeResponse = rawResponse;
        }

        console.log("");
        console.log("=================================");
        console.log("BLOCKCHAIN CERTIFICATE CREATED");
        console.log("=================================");
        console.log("Certificate ID:", certificateId);
        console.log("Chaincode response:", chaincodeResponse);
        console.log("=================================");

        return {

            success: true,

            certificateId,

            hash: fileHash,

            ipfsCID,

            chaincodeResponse

        };

    } catch (error) {

        console.error("");
        console.error("=================================");
        console.error("BLOCKCHAIN STORE ERROR");
        console.error("=================================");
        console.error(error);
        console.error("=================================");

        return {

            success: false,

            certificateId,

            error: error.message

        };

    }

};


// ============================================================
// Verify Certificate on Hyperledger Fabric
// ============================================================

exports.verifyHashOnBlockchain = async (
    certificateId,
    fileHash
) => {

    try {

        if (!certificateId) {
            throw new Error(
                "Certificate ID is required."
            );
        }

        if (!fileHash) {
            throw new Error(
                "File hash is required."
            );
        }

        const contract =
            await connectFabric();

        console.log("");
        console.log("=================================");
        console.log("BLOCKCHAIN: VERIFY CERTIFICATE");
        console.log("=================================");
        console.log(
            "Certificate ID:",
            certificateId
        );
        console.log(
            "SHA-512:",
            fileHash
        );
        console.log("=================================");

        const result =
            await contract.evaluateTransaction(
                "VerifyCertificate",
                certificateId,
                fileHash
            );

        // ====================================================
        // IMPORTANT:
        //
        // Fabric Gateway returns a Uint8Array.
        //
        // Calling result.toString() directly converts the
        // numeric bytes into:
        //
        // 116,114,117,101
        //
        // These are the ASCII values for:
        //
        // t r u e
        //
        // Therefore we must explicitly convert the result
        // into a Node.js Buffer before converting to UTF-8.
        // ====================================================

        const response =
            Buffer.from(result)
                .toString("utf8")
                .trim();

        console.log("");
        console.log("=================================");
        console.log("RAW FABRIC VERIFY RESPONSE");
        console.log("=================================");
        console.log("Response:", response);
        console.log("Response length:", response.length);
        console.log("Response JSON:", JSON.stringify(response));
        console.log("=================================");

        const exists =
            response === "true";

        console.log("");
        console.log("Blockchain verification result:");
        console.log(exists);
        console.log("");

        return {

            exists,

            certificateId,

            hash: fileHash

        };

    } catch (error) {

        console.error("");
        console.error("=================================");
        console.error("BLOCKCHAIN VERIFY ERROR");
        console.error("=================================");
        console.error(error);
        console.error("=================================");

        return {

            exists: false,

            certificateId,

            error: error.message

        };

    }

};