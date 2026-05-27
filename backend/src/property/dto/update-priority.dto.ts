import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePriorityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  priority: number;
}
