import { Request } from "express";
import config from "config";
import jwksClient from "jwks-rsa";
import { expressjwt, GetVerificationKey } from "express-jwt";

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: String(config.get("auth.jwksUri")),
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ["RS256"],
    getToken(req: Request) {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.split(" ")[1] !== undefined) {
            const token = authHeader.split(" ")[1];
            if (token) {
                return token;
            }
        }

        const { accessToken: token } = req.cookies;
        return token;
    },
});
