const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy
const {ExtractJwt} = require("passport-jwt")
const {CheckUser, InsertNewEmployee, matchPassword, GetUserById} = require("../controller/user.controller");

function initialize(passport){
    async function authenticateUser(username,password,done) {
        try{
            console.log("inside auth")
            // CHECKING IF USER IF NULL
            const user = await CheckUser(username);
            console.log(user, "this user")
            if(!user) {return done(null,false,{message:"Invalid User"});}
            // CHECKING IF USER PASSWORD IF NULL
            const passwordMatch = await matchPassword(password,user.password);
            if(!passwordMatch) return done(null,false,{message:"Password Invalid"});
            // PASSED CHECKING
            return done (null, user)
        }catch (error){
            return done(error,false);
        }
    }

    passport.use("auth-login",
    new LocalStrategy({
        usernameField: "username",
        passwordField: "password"
    },
        authenticateUser
    ));

    // USING THE JWT STRATEGY
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromHeader("authorization"),
        secretOrKey: process.env.SECRET_KEY,
        },
        async(jwtPayload,done) =>{
            try {                
                console.log("inside try")
                const user = jwtPayload.user;
                done(null,user)
            } catch (error) {
                done(error,false)
            }
        }
    ))

    // Stores user details inside session. serializeUser determines which data of the user
    // object should be stored in the session. The result of the serializeUser method is attached
    // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
    //   the user id as the key) req.session.passport.user = {id: 'xyz'}
    passport.serializeUser((user,done)=>{
        // console.log("the user"+user)
        done(null,user.id)
    });

    // In deserializeUser that key is matched with the in memory array / database or any data resource.
    // The fetched object is attached to the request object as req.user
    passport.deserializeUser(async(id,done) =>{
        // GETS USER BY ID AND DESERIALIZES ITS ATTRIBUTES SO YOU CAN ACCESS IT BY USER.WHATEVER
        let user = await GetUserById(id);
        return done(null,user);
    })
}

module.exports = initialize