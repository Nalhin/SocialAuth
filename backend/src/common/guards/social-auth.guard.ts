// import { AuthGuard } from '@nestjs/passport';
// import { GqlExecutionContext } from '@nestjs/graphql';
//
// export const SocialAuthGuard = (type: any) => {
//   return class SocialAuthGuard extends AuthGuard(type) {
//     getRequest(context: GqlExecutionContext) {
//       const ctx = GqlExecutionContext.create(context);
//       return ctx.getContext().req;
//     }
//   };
// };
