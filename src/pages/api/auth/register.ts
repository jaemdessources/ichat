import clientPromise from "../../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import * as mongoDB from "mongodb";
import { hash } from "bcrypt";
import { generateToken } from "@/utils/jwt";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const client = await clientPromise;
    const users: mongoDB.Collection = client.db("ichat").collection("users");
    const data = req.body;
    const hashedPassword = await hash(data.password, 10);
    console.log(hashedPassword);
    await users
      .insertOne({ ...data, password: hashedPassword })
      .then((result) => res.status(200).json(result))
      .catch((e) => res.status(400).json(e));
  } else {
    res.status(405).json({ message: "Bad Request, only POST accepted" });
  }
}
