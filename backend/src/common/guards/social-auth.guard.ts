import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomAuthGuard } from './custom-auth.guard';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialAuthGuard extends CustomAuthGuard() {
  getRequest(context: GqlExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const { input } = ctx.getArgs();

    req.body = {
      ...req.body,
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: input.accessToken,
      provider: input.provider,
    };
    return req;
  }
}
