const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { port, jwtSecret } = require("./config");
const jwt = require("jsonwebtoken");
const app = express();
require("./models");

app.use(express.static("public"));
app.use(morgan("combined"));
app.use(cors({
	origin: true,
	credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(function(req, res, next) {
  if (req.cookies.user) {
    try {
      req.user = jwt.verify(req.cookies.user, jwtSecret).data;
    } catch (e) {
      res.cookie("user", "");
      res
        .status(403)
        .json({ message: `user not authorized` })
        .end();
    }
    console.log(req.user);
  }
  next();
});

require("./routes/users")(app);
require("./routes/posts")(app);

app.listen(port, () => console.log(`App listening on port ${port}!`));
