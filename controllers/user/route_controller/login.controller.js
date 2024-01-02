async function Login(req, res, next) {
  // if you want you can cut the passport authenticate muddleware below and declare it under a function
  // and then pass the function in the router column then you will not have to pass the (res,req,next)
  // because what you did was create a func and called it becaeuse passportjs middleware func are called
  // before express funcs
  passport.authenticate(
    "auth-login",
    { session: false },
    async (err, user, info) => {
      try {
        if (err) {
          console.log(err, "err");
          res.json(err);
        }
        if (user) {
          console.log(user);
          const payload = { id: user.id, username: user.username };
          jwt.sign(
            { user: payload },
            process.env.SECRET_KEY,
            { expiresIn: 604800 },
            (err, token) => {
              if (err) {
                return res.json({
                  message: "Failed To Login",
                  token: null,
                });
              }
              res.json({
                token: token,
              });
            }
          );
        }
        if (info) {
          console.log(info, "info");
          res.json(info);
        }
      } catch (err) {
        res.json(err);
        return next(err);
      }
    }
  )(req, res, next);
}

module.exports = { Login };
