import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const SocialProfile = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const profile = GqlExecutionContext.create(ctx).getContext().req.user;
    return data ? profile && profile[data] : profile;
  },
);
