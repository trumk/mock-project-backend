import * as jose from 'jose'
import dotenv from "dotenv";
dotenv.config();

const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_KEY)
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_KEY)
const alg = 'HS256'

export const generateAccessToken = async(user) => {
    return await new jose.SignJWT({
        id: user.id,
        email: user.email,
        role: user.role
    })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('sadboiz')
        .setExpirationTime('2h')
        .sign(accessSecret)
}

export const generateRefreshToken = async (user) => {
    return await new jose.SignJWT({
        id: user.id,
        email: user.email,
        role: user.role
    })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('sadboiz')
        .setExpirationTime('365d')
        .sign(refreshSecret)
}

export const verifyJWT = async (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        const accessToken = token.split(" ")[1];
        try {
            const { payload } = await jose.jwtVerify(accessToken, accessSecret);
            req.user = payload;
            
            next();
        } catch (error) { 
            return res.status(403).json("Token is not valid");
        }
    } else {
        return res.status(401).json("You are not authenticated");
    }
}

export const verifyAdmin = async (req, res, next) => {
    verifyJWT(req, res, () => { 
        if (req.user.role == "admin") {
            next();
        }
        else {
            return res.status(403).json("You don't have permission");
        }
    })
}

export const requestAccessToken = async (req, res) => {
    try {
        const {refreshToken} = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ error: "You're not authenticated" });
        }
        const decoded = await jose.jwtVerify(refreshToken, refreshSecret);
        const newAccessToken = await generateAccessToken(decoded);

        return res.status(200).json({
            accessToken: newAccessToken
        });
    } catch (err) {
        return res.status(500).json(err);
    }
}




