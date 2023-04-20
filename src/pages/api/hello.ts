// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import authenticate from "./middlewares/authenticate";
import authorize from "./middlewares/authorize";
type Data = {
  name: string;
};

export default authenticate(
  authorize(function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.status(200).json({ name: "John Doe" });
  })
);
