import { Err, Ok, Result } from '@hqoss/monads';
import ensureError from 'ensure-error';
import Exception from 'rerror';

import { UserService } from '../../interfaces';
import { UserRegistration } from '../user-registration';
import { UserSettingsInput } from '../user-settings-input';

export class UserSettingsUpdateCommand {
    // maybe create service for notify errors
    constructor(private readonly userService: UserService) {}

    async execute(data: UserSettingsInput) {
        let result: Result<
            UserRegistration,
            { code: string; errors: { [field: string]: string[] } }
        >;

        if (!data.password) {
            delete data.password;
        }

        try {
            result = Ok(await this.userService.updateCurrentUser(data));
        } catch (error) {
            result = Err(error);
        }
        return result;
    }
}