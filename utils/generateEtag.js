import crypto from 'crypto';

const generateEtag = (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
}

export default generateEtag;