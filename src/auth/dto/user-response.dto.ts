export class UserResponseDto {
    status: number;
    description: string;
    user: { id: number, name: string, email: string, wallet: number }
}
