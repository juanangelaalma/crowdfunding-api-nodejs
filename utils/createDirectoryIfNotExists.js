import fs from "fs";
import path from "path";

const createDirectoryIfNotExists = (directory) => {
    const parentDir = path.dirname(directory)
    if(!fs.existsSync(parentDir)) {
        createDirectoryIfNotExists(parentDir)
    }
    if(!fs.existsSync(directory)) {
        fs.mkdirSync(directory)
    }
}

export default createDirectoryIfNotExists