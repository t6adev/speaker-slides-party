import { z } from 'zod';
import { config } from '../presentation.config';

const configSchema = z.object({
  title: z.string(),
  confettiEmojis: z.array(z.string().emoji()).length(9),
});

export const { title, confettiEmojis } = configSchema.parse(config);
