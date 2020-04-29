import * as Joi from '@hapi/joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(8000),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_DEV: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DB_TEST: Joi.string().when('NODE_ENV', {
    is: 'test',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  FACEBOOK_KEY: Joi.string(),
  FACEBOOK_SECRET: Joi.string(),
  GOOGLE_KEY: Joi.string(),
  GOOGLE_SECRET: Joi.string(),
});
