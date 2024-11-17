export const port = process.env.PORT || 3000;

export const dbAddress =
  process.env.DB_ADDRESS || "mongodb://127.0.0.1:27017/weblarek";
export const upload = process.env.UPLOAD_PATH || "images";

export const temp = process.env.UPLOAD_PATH_TEMP || "temp";
export const server = process.env.ORIGIN_ALLOW || "http://localhost:5173";

export const refreshTokenExpiry = process.env.AUTH_REFRESH_TOKEN_EXPIRY || "7d";
export const accessTokenExpiry = process.env.AUTH_ACCESS_TOKEN_EXPIRY || "10m";

export const refreshTokenSecret =
  process.env.AUTH_REFRESH_TOKEN || "some-secret-refresh-key";
export const accessTokenSecret =
  process.env.AUTH_REFRESH_TOKEN || "some-secret-access-key";
