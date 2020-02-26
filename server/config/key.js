if(process.env.NODE_ENV === "product"){
    module.exports = require('./prod')
} 
else {
    module.exports = require('./dev')
}