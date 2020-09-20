const idGenerator = () => {
    return '_' + Math.random().toString(36).substr(2, 13);
}

module.exports = {
    idGenerator
}