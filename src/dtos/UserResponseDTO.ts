export class UserResponseDTO {
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly image?: string;
    constructor(name: string, email: string, phone: string, image?: string) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        if (image) {
            this.image = image;
        }
    }
}
