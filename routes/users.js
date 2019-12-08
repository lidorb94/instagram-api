const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

authorize = (req, res, next) => {
  if (!req.user) {
    return red.status(401).end();
  }
  next();
};

usersRoutes = (app) => {
  app
    .get("/api/users", (req, res) => {
      User.find({}).then(list => res.json(list).end());
    })
    .post("/api/users", (req, res) => {
      const user = new User(req.body);
      user
        .save()
        .then(user => res.json(user).end())
        .catch(err =>
          res
            .status(400)
            .json(err)
            .end()
        );
    })
    .get("/api/users/me", (req, res) => {
      User.findById(req.user)
        .select("_id username name birthDate gender about created")
        .then(user => res.json(user));
    })
    .get("/api/users/:userId", (req, res) => {
      User.findById(req.params.userId)
        .select("name birthDate gender about")
        .then(user => res.json(user).end())
        .catch(() => res.status(400).end());
    })
    .delete("/api/users/:userId", (req, res) => {
      User.findById(req.params.userId)
        .then(user => user.remove())
        .then(user => res.json(user).end())
        .catch(() => res.status(400).end());
    })
    .put("/api/users/:userId", (req, res) => {
      User.findById(req.params.userId)
        .then(user => Object.assign(user, req.body))
        .then(user => user.save())
        .then(user => res.json(user).end())
        .catch(err => {
          console.error(err);
          res
            .status(400)
            .json({ message: "failed to update" })
            .end();
        });
    })
    .post("/api/users/login", (req, res) => {
      User.findOne({
        username: req.body.username,
        password: req.body.password
      })
        .then(user => {
          if (!user) {
            res.status(403).end();
            return;
          }

          const token = jwt.sign({ data: user._id }, jwtSecret, {
            expiresIn: "7d"
          });

          res.cookie("user", token);
          console.log("TOKEN CHECK: ", token);
          res.end();

        })
        .catch(() => res.status(400).end());
    });
}

module.exports = usersRoutes;
