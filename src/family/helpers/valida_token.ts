export const isTokenExpired = (timestamp) => {
    if (Date.now() - timestamp > 10 * 60 * 1000) {
        return true;
    }
    return false;
}

export const istokenValid = (decodedToken) => {
    if (typeof decodedToken !== 'object' || decodedToken === null) {
        return true;
    }
    return false;   
}