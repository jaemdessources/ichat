import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { verifyAccessToken } from "@/utils/jwt";

export default function authorize(next: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const apiAccessToken = req.headers.authorization?.split(" ")[1];
    const headers = { ...req.headers };
    let reason;
    try {
      if (!apiAccessToken) {
        reason = "No accessToken";
        throw new Error();
      }
      reason = "token invalid";
      const { username } = verifyAccessToken(<string>apiAccessToken) as {
        username: string;
      };

      /** Attach the payload to the request object for later use */
      if (username === "system") return await next(req, res);
      else throw new Error();
      // Call the next middleware or API route handler function
    } catch (error: any) {
      console.error(error);
      return res.status(403).json({
        message: "Not authorized " + reason,
        reqKeys: Object.keys(req).map((key) => key),
        keys: [
          headers,
          process.env.NEXT_PUBLIC_API_ACCESS_TOKEN,
          process.env.NEXT_PUBLIC_CONTENT_API_URL,
          process.env.NEXT_PUBLIC_CONTENT_API_TOKEN,
          process.env.MONGODB_URI,
          process.env.JWT_ACCESS_TOKEN_SECRET,
          process.env.JWT_REFRESH_TOKEN_SECRET,
        ],
      });
    }
  };
}
