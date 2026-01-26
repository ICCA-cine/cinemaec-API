import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsEnum, IsOptional } from 'class-validator'
import { UserRole } from '../../../common/enums/user-role.enum'
import { PermissionEnum } from '../../../common/enums/permissions.enum'

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'Nuevo rol del usuario',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole)
  role: UserRole

  @ApiPropertyOptional({
    description: 'Array de permisos del usuario (solo para admins)',
    enum: PermissionEnum,
    isArray: true,
    example: [PermissionEnum.ADMIN_SPACES, PermissionEnum.ADMIN_MOVIES],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PermissionEnum, { each: true })
  permissions?: string[]
}
