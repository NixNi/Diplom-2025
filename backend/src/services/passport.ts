import passportJWT from "passport-jwt";
import config from "../config";
import user from "../types/user";
import { Request } from "express";
import { getUserById } from "src/models/user.model";

const cookieExtractor = (req:Request) => {
  return req && req.cookies && req.cookies.token;
};

const jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([cookieExtractor]),
};
const jwtStrategy = new passportJWT.Strategy(jwtOptions, (jwtPayload, done) => {
  try {
    const user = getUserById(jwtPayload.uid)
if (user) {
        return done(null, user);
      }
      return done(null, false);
  } catch (err) {
    done(err, undefined)
  }
});

exports.jwt = jwtStrategy;
