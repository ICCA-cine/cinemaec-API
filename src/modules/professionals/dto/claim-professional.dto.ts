import { IsInt, IsOptional, Min } from 'class-validator'

export class ClaimProfessionalDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  professionalId?: number
}
