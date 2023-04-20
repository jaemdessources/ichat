import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: any) => {
  const token = jwt.sign(payload, <string>process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const generateRefreshToken = (payload: any) => {
  return jwt.sign(payload, <string>process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) => {
  const decoded = jwt.verify(token, <string>process.env.JWT_ACCESS_TOKEN_SECRET);
  return decoded;
};
export const verifyRefreshToken = (token: string) => {
  const payload = jwt.verify(token, <string>process.env.JWT_REFRESH_TOKEN_SECRET);
  return payload;
};
