import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Attaches JWT user when a valid Bearer token is sent; does not fail when missing. */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string } }>();
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return true;
    }
    return (super.canActivate(context) as Promise<boolean>).catch(() => true);
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser | undefined {
    if (err || !user) return undefined;
    return user;
  }
}
