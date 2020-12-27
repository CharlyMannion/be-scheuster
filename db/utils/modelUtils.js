const checkValid = (validKeys, queryKey) => {
    if (validKeys.includes(queryKey) || queryKey === undefined) {
        return true;
    } else {
        return false;
    }
}

module.exports = { checkValid };