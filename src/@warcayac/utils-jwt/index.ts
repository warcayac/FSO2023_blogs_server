import { SignJWT, jwtVerify } from "jose";
import { Err, Ok, Result, type TJMap } from "../types-common";
import { errorMsg } from "../const-elysia";


/* ------------------------------------------------------------------------------------------ */
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

/* ------------------------------------------------------------------------------------------ */
export async function getDecodedJwt(headers: Headers): Promise<Result<TJMap,string>> {
  // discard the "Bearer " prefix
  const encodedJwt = headers.get('Authorization')!.substring(7);

  try {
    const { payload } = await jwtVerify(encodedJwt, JWT_SECRET);
    return new Ok(payload);
  } catch (error) {
    if (error instanceof Error) { // Ensure error is an instance of Error
      return  new Err( error.name === 'JWTExpired'
        ? 'Token is expired'
        : error.message
      );
    }
    return new Err(errorMsg.UNKNOWN_ERROR);
  }    
}

/* ------------------------------------------------------------------------------------------ */
export async function getEncodedJwt(payload: TJMap, alg: string = 'HS256', expireAt: string = '1h') : Promise<string> {
  const encodedToken = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expireAt)
    .sign(JWT_SECRET);
    
  return encodedToken;
}