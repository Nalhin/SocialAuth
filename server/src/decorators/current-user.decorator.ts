import { createParamDecorator } from '@nestjs/common';

export const CurrentUserDecorator = createParamDecorator(
  (data, [root, args, ctx, info]) => ctx.req.user,
);
