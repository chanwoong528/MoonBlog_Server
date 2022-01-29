const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
  console.log(req.headers["x-access-token"]);
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({ msg: "No Token Containing" });
  } else {
    jwt.verify(token, "moonblogSecret", (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(408).send({ msg: "accToken expired!" });
        } else {
          return res
            .status(401)
            .send({ isLoggedIn: false, msg: "Failed To Verify User" });
        }
      } else {
        req.auth = decoded;
        next();
      }
    });
  }
}

module.exports = {
  isLoggedIn,
};
