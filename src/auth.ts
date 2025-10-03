import {Request, Response ,NextFunction} from "express";


const USERNAME = "admin"
const PASSWORD = "qwerty"


export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Basic ")) {
   return res.status(401).send("Unauthorized");
  }

  const base64Credentials: string = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const [username, password] = credentials.split(":");

  if (username === USERNAME && password === PASSWORD) {
    return next();
  }

  res.status(401).send("Unauthorized");
};
