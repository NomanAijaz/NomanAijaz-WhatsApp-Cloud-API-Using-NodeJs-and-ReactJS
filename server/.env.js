const production = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production',
};

const development = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: '9000',
    Meta_WA_accessToken:'EAALtvRCJ8bgBAOfyGClEVKJfsMZC1MZCTLAYlTZCmXSZAynxYZCkxu4w2eG6KDdfqqN0h9K6sRySlUvZAFvtEDVLvuAtHYoVsOVaz5inwp5IbvZAsqg022pTXkdA8aZBS5OOOpuGMcsdsZAdEDSCqATWvrXrqm1ZCyWPdLkk3I0ZAXfpQm1kYXCyZBZARFZAg3ANjVKPFtTCfVZBPZAxEZBdw3z4AEDx4',
    Meta_WA_SenderPhoneNumberId: '104822562467332',
    Meta_WA_wabaId: '107373188876152',
    Meta_WA_VerifyToken: 'NomanAijaz1122',
};

const fallback = {
    ...process.env,
    NODE_ENV: undefined,
};

module.exports = (environment) => {
    console.log(`Execution environment selected is: "${environment}"`);
    if (environment === 'production') {
        return production;
    } else if (environment === 'development') {
        return development;
    } else {
        return fallback;
    }
};