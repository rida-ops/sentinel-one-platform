import logger from '@sentinel/logger';
import { aiClassificationService } from './services/classification';

async function main() {
  logger.info('AI Center Service starting...');

  // Example: Listen to incident events and classify them
  // TODO: Connect to Redis event stream or Kafka

  logger.info('AI Center Service ready');
}

main().catch((error) => {
  logger.error('AI Center Service failed to start', { error });
  process.exit(1);
});
