import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../entities';

export const CurrentUser = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext): User => {

    let req;

    if (ctx.getType() === 'http') {
        req = ctx.switchToHttp().getRequest();
      } else {
        const gqlContext = GqlExecutionContext.create(ctx);
        req = gqlContext.getContext().req;
      }

    // const gqlContext = GqlExecutionContext.create(ctx);
    // const context = gqlContext.getContext();
    // const req = context.req;
    // const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      return;
    }

    return field ? user[field] : user;
  },
);
