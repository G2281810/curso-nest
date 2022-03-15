import { Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
        message: 'Password is too weak'
    })
    password: string;

}