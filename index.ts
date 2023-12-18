import express, { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const app = express();
const port = 3000;

app.use(express.json());

const prisma = new PrismaClient();

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  return res.json(users);
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    return res.json(user);
  } catch (e) {
    return res.status(400).json(e);
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });
    return res.json(user);
  } catch (e) {
    return res.status(400).json(e);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
