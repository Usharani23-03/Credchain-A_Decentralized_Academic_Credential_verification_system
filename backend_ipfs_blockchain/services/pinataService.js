console.log("Pinata JWT exists:", !!process.env.PINATA_JWT);
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const uploadToPinata = async (filePath, fileName) => {

    const data = new FormData();

    data.append(
        "file",
        fs.createReadStream(filePath),
        fileName
    );

    try {

        const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data,
            {
                maxBodyLength: Infinity,
                headers: {
                    Authorization: `Bearer ${process.env.PINATA_JWT}`,
                    ...data.getHeaders()
                }
            }
        );

        return response.data;

    } catch (error) {

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        throw error;

    }

};

module.exports = uploadToPinata;