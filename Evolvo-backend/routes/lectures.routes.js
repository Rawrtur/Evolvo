import { Router } from "express";

const lectureRouter = Router();

lectureRouter.get("/", (req, res) => res.send({ message: "GET All Lectures" }));

lectureRouter.get("/:id", (req, res) =>
  res.send({ message: "GET Lecture Details" }),
);

lectureRouter.post("/", (req, res) => res.send({ message: "CREATE Lecture" }));

lectureRouter.put("/:id", (req, res) =>
  res.send({ message: "UPDATE Lecture" }),
);

lectureRouter.delete("/:id", (req, res) =>
  res.send({ message: "DELETE Lecture" }),
);

lectureRouter.get("/user/:id", (req, res) =>
  res.send({ message: "GET All User Lectures" }),
);

export default lectureRouter;
