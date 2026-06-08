const axios = require('axios');

async function testPerformance() {
  console.log("Running performance tests...");
  const apiUrl = 'http://localhost:4000/api/topics';
  
  const testTopic = `PerfTest_${Date.now()}`;

  // Test SC-001: Submission < 10s
  let start = Date.now();
  try {
    await axios.post(apiUrl, { topic: testTopic });
    let duration = Date.now() - start;
    console.log(`[SC-001] First submission: ${duration}ms (${duration < 10000 ? 'PASS' : 'FAIL'})`);
  } catch (err) {
    console.log(`[SC-001] First submission failed: ${err.message}`);
  }

  // Test SC-004: Duplicate warning < 1s
  start = Date.now();
  try {
    await axios.post(apiUrl, { topic: testTopic });
  } catch (err) {
    if (err.response && err.response.status === 409) {
      let duration = Date.now() - start;
      console.log(`[SC-004] Duplicate warning: ${duration}ms (${duration < 1000 ? 'PASS' : 'FAIL'})`);
    } else {
      console.log(`[SC-004] Duplicate check failed with unexpected error: ${err.message}`);
    }
  }
}

testPerformance();
