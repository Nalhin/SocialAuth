export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? 'secret',
  expiration: process.env.JWT_EXPIRES_IN ?? '7 days',
};

export const jwtOptions = {
  secret: jwtConstants.secret,
  signOptions: { expiresIn: jwtConstants.expiration },
};
