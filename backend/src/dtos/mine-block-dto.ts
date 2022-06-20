import { IsNotEmpty, IsString } from 'class-validator';

export class MineBlockDto {
  @IsString()
  @IsNotEmpty()
  public publicKey: string;
}
