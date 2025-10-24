export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly age?: number;
  readonly address?: string;
}