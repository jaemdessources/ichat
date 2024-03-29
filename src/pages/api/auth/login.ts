import { getCookie, setCookie } from "cookies-next";
import * as mongoDB from "mongodb";
import { compare } from "bcrypt";
import clientPromise from "@/lib/mongodb";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt";

import authorize from "../middlewares/authorize";
import {
  LONG_REFRESH_TOKEN_DAYS_COUNT,
  SHORT_REFRESH_TOKEN_DAYS_COUNT,
} from "@/utils/constants";
export default authorize(async (req, res) => {
  try {
    if (req.method === "POST") {
      const refreshToken = getCookie("refreshToken", { req, res });

      //Try login in with the refresh token
      if (refreshToken) {
        // Verify the refresh token

        const { username } = verifyRefreshToken(<string>refreshToken) as {
          username: string;
        };

        // Generate a new access token
        const accessToken = generateAccessToken({ username });

        // Set a cookie with the new access token

        setCookie("accessToken", accessToken, {
          req,
          res,
          httpOnly: true,
          secure: process.env.NODE_ENV === "development",
          path: "/",
          maxAge: 1 * 24 * 60 * 60,
        });

        return res.status(200).end();
      } else {
        const client = await clientPromise;
        const users: mongoDB.Collection = client.db("ichat").collection("users");
        const data = req.body;
        const username = data?.username;
        const user = await users
          .find({ username: username })

          .collation({ locale: "en", strength: 2 })
          .toArray()
          .then((arr) => arr?.[0])
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });

        const passwordsMatch = user
          ? await compare(data.password, user?.password)
          : null;

        if (user && passwordsMatch) {
          users
            .updateOne({ id: user.id }, { $set: { online: true } })
            .catch((err) => res.status(500).json(err));

          // Generate an access token and a refresh token
          const accessToken = generateAccessToken({ username });
          const refreshToken = generateRefreshToken({ username });
          const refreshTokenDuration =
            (data.rememberUser
              ? LONG_REFRESH_TOKEN_DAYS_COUNT
              : SHORT_REFRESH_TOKEN_DAYS_COUNT) * 86_400;

          // Set the access token as a cookie with a short expiration time

          setCookie("accessToken", accessToken, {
            req,
            res,
            httpOnly: true,
            path: "/",
            maxAge: 1 * 60 * 60,
          });

          // Set the refresh token as a cookie with a longer expiration time

          setCookie("refreshToken", refreshToken, {
            req,
            res,
            httpOnly: true,
            path: "/",
            maxAge: refreshTokenDuration,
          });

          // Return the access token in the response
          return res.status(200).end();
        } else throw new Error();
      }
    } else {
      return res.status(405).json({ message: "Bad Request, only POST accepted" });
    }
  } catch (err) {
    process.env.NODE_ENV === "test" && console.log(err);

    return res.status(401).json({
      message: "Could not login user",
    });
  }
});
