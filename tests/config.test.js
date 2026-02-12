const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function runConfig({ hostname, pathname }) {
  const code = fs.readFileSync(
    path.join(__dirname, '..', 'js', 'config.js'),
    'utf8'
  );

  const context = {
    window: { location: { hostname, pathname } },
    console: { log() {} }
  };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.window.API_BASE_URL;
}

assert.strictEqual(
  runConfig({ hostname: '', pathname: '/E:/x/OFFICERINCHARGE/officeinchargenew/assign.html' }),
  'http://localhost:3001'
);

assert.strictEqual(
  runConfig({ hostname: 'localhost', pathname: '/E:/x/DATAENTRY/dashboard.html' }),
  'http://localhost:3000'
);

assert.strictEqual(
  runConfig({ hostname: '192.168.1.50', pathname: '/E:/x/OFFICERINCHARGE/officeinchargenew/dashboard.html' }),
  'http://192.168.1.50:3001'
);

console.log('config.test.js ok');
