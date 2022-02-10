const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).send({ msg: "No Token Containing" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
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
function isLoggedInAdmin(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({ msg: "No Token Containing" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(408).send({ msg: "accToken expired!" });
        } else {
          return res
            .status(401)
            .send({ isLoggedIn: false, msg: "Failed To Verify User" });
        }
      } else {
        req.auth = decode;
        if (req.auth.admin) {
          next();
        } else {
          return res.status(401).send({ msg: "You are not Admin" });
        }
      }
    });
  }
}

module.exports = {
  isLoggedIn,
  isLoggedInAdmin,
};
