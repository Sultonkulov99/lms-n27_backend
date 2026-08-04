import {
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class LoginDto {
  @IsString()
  @IsPhoneNumber()
  phone!: string;

  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        "Parol juda kuchsiz (katta va kichik harflar, raqam va belgi talab qilinadi).",
    },
  )
  password!: string;
}
