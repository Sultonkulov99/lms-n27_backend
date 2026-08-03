import {DocumentBuilder} from "@nestjs/swagger"
export const config = new DocumentBuilder()
    .setTitle('LMS N27')
    .setVersion('1.0')
    .build();