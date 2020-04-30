import { Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthTypes } from '../../auth/types/auth.types';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthTypes.JWT) {
  getRequest(context: GqlExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  handleRequest(err: any, user: any) {
    return user;
  }
}
