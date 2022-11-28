const production = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production',
};

const development = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: '9000',
    Meta_WA_accessToken:'EAALtvRCJ8bgBAFDzwZAZAqRYTI1Y2lEf0EQU6QAoZAR6FYSMsuAPT9UbLUMDEgAnZCi4GgjX9utlVYYpGOtO3MtdKG9PrtOvakZCYeizQO6jWPpatitxbmVHYeZA01q3ZACZAo27X1jX27GfQspRDEoh2l54kwh88SpkVAvPYJZBslArqeYBzQucE8TJIvZAjVfnmDVaDBP01907UrghBQmbxM',
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