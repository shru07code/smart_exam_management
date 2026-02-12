const assert = require('assert');
const { normalizeCsvHeader, toIsoDate } = require('../lib/timetableCsv');

assert.strictEqual(normalizeCsvHeader('\ufeffExam Date '), 'exam_date');
assert.strictEqual(normalizeCsvHeader(' Subject-Code '), 'subject_code');
assert.strictEqual(normalizeCsvHeader('Time Slot'), 'time_slot');

assert.strictEqual(toIsoDate('2026-1-2'), '2026-01-02');
assert.strictEqual(toIsoDate('2026/1/2'), '2026-01-02');
assert.strictEqual(toIsoDate('02/01/2026'), '2026-01-02');
assert.strictEqual(toIsoDate('02-01-26'), '2026-01-02');
assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(toIsoDate('45200')));

console.log('timetableCsv.test.js ok');
