import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.join(__dirname, `../../env/.env.development`)
})

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_KEY = process.env.JWT_SECRET_KEY;
  export const TOKEN_EXPIRES_IN = `${process.env.JWT_EXPIRES_IN} days`
}
