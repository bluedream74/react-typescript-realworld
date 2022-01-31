import { inject } from 'njct';
import { Err, Ok, Result } from 'rsts';

import { UserService } from '../../user';
import { Profile } from '../interfaces';

export class FollowUserCommand {
  constructor(private readonly userService = inject<UserService>('userservice')) {}

  async execute(name: string): Promise<Result<Profile, Error>> {
    let result: Result<Profile, Error>;
    try {
      result = Ok(await this.userService.followUser(name));
    } catch {
      result = Err(new Error('FollowUser'));
    }
    return result;
  }
}
