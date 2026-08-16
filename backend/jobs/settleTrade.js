const cron = require('node-cron');
const { processDueTrades } = require('../services/tradeService');

cron.schedule('0 */2 * * *', async () => {
  console.log('Processing due trades...');
  try {
    await processDueTrades();
  } catch (error) {
    console.error('Error processing due trades:', error.message);
  }
});
