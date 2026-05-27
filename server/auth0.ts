import { expressjwt as jwt, GetVerificationKey } from 'express-jwt'
import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'
import jwks from 'jwks-rsa'

let domain = process.env.VITE_AUTH0_DOMAIN || 'https://raumati-2026-ciaran.au.auth0.com'
const audience = process.env.VITE_AUTH0_AUDIENCE || 'https://watgig/api'

// Ensure domain starts with https:// and doesn't end with a slash
if (!domain.startsWith('http')) {
  domain = `https://${domain}`
}
domain = domain.replace(/\/$/, '')

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 20,
    jwksUri: `${domain}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: audience,
  issuer: `${domain}/`,
  algorithms: ['RS256'],
})

export default checkJwt

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface JwtRequest<TReq = any, TRes = any> extends Request<
  ParamsDictionary,
  TRes,
  TReq
> {
  auth?: JwtPayload
}
