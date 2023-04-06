import { SetMetadata } from '@nestjs/common';
import { ROLES } from 'src/utils';
export const RoleProtected = (...args: string[]) => {
    return SetMetadata(ROLES, args)
};