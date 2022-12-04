const production = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production',
};

const development = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: '9000',
    Meta_WA_accessToken:'EAALtvRCJ8bgBAHHZAGaIvj96uSMHwFMZAb9zgzPjAjebbuVZBVZCinoK7l1JQLT3pzXSUZBNBYgzRWZCRv4YBcxoDa1EfLnOyeO1TNSaA1WNBBxVboZAkuXHhhrckaZBJ5qzNyJdx2W7UPENEtPnReGZCnKH1w2ATpM1zsGsh5JJhws0sOUa1cZB2B9Wi3o6J4M78UUZBsFq1dpPFpIN6oZCUzEZB',
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