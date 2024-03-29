import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { verifyAccessToken } from "@/utils/jwt";
import clientPromise from "@/lib/mongodb";

export default function authorize(next: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const apiAccessToken = req.headers.authorization?.split(" ")[1];

    try {
      if (!apiAccessToken) {
        throw new Error();
      }

      const { username } = verifyAccessToken(<string>apiAccessToken) as {
        username: string;
      };

      /** Attach the payload to the request object for later use */
      if (username === "system") await next(req, res);
      else throw new Error();

      // Call the next middleware or API route handler function
    } catch (error: any) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }
  };
}
