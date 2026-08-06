import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  "jwt-access",
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY as string,
    });
  }

  async validate(payload: any) {
<<<<<<< HEAD
    return { id: payload.id, email: payload.email, role: payload.role };
}

=======
    return { id: payload.sub, role: payload.role };
  }
>>>>>>> cbc6c45b767abca1c1774cc1226bd02088d94d67
}
