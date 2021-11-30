const fs = require('fs');

// read file and make object
let content = JSON.parse(fs.readFileSync('./nfts.json', 'utf8'));

// print data
console.log('content[11].owner')
console.log(content[11].owner)
//content.expiry_date = 999999999999;

// edit owner
content[11].owner = '0xTREB'

//write file
fs.writeFileSync('./nfts.json', JSON.stringify(content));

// print again..-