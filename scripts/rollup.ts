import './load-env';
import { rollupPending } from '../src/lib/server/analytics';

// Nightly roll-up of raw events into daily_stats. Cron example: 10 0 * * * cd /var/www/felibest && npm run rollup
console.log(`Rolled up ${rollupPending()} day(s).`);
