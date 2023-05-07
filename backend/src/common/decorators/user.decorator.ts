import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext) => {
    // const gqlContext = GqlExecutionContext.create(context);
    // const ctx = gqlContext.getContext();
    // const req = ctx.req;
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      return;
    }

    return field ? user[field] : user;
  },
);
