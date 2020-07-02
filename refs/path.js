const path = require('path');

console.log('1: ', __filename);
console.log('2: ', path.basename(__filename));
console.log('3: ', path.dirname(__filename));
console.log('4: ', path.extname(__filename));
console.log('5: ', path.parse(__filename));
console.log('6: ', path.parse(__filename).base);

console.log('join: ', path.join(__dirname, 'test', 'second.html'));
console.log('resolve: ', path.resolve(__dirname, '/test', '/second.html'));
