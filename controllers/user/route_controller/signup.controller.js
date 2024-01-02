 async function SignUp (req, res, next) {
    let errors = [];
    let {
        firstname,
        lastname,
        username,
        email,
        // age,
        country,
        password,
        confirmPassword,
    } = req.body;

    console.log(req.body);

    if (
        !firstname ||
        !lastname ||
        !username ||
        !email ||
        // !age ||
        !country ||
        !password ||
        !confirmPassword
    ) {
        errors.push({message: "Enter all fields"});
    }
    // if ((age && age > 80) || age.includes(".")) {
    //   errors.push({ message: "Age Not Accepted" });
    // }
    if (password && password.length < 6) {
        errors.push({message: "Password must be a least 6 characters long"});
    }
    if (password !== confirmPassword) {
        errors.push({message: "Passwords do not match"});
    }
    if (errors.length > 0) {
        console.log(errors);
        res.send({message: errors});
    } else {
        let emailExists = await CheckEmail(email);
        let userExists = await CheckUser(username);

        if (!userExists) {
            if (!emailExists) {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, async function (err, hash) {
                        let insertedClient = await InsertNewClient(
                            firstname,
                            lastname,
                            username,
                            email,
                            // age,
                            country,
                            hash
                        );
                        if (insertedClient) {
                            res.send({response: "done"});
                        } else {
                            errors.push({message: "Unknown err occured"});
                            res.send({response: errors});
                        }
                    });
                });
            } else {
                errors.push({message: "User with the same Email exists"});
                res.send({response: errors[0].message});
            }
        } else {
            errors.push({message: "User with the same Username exists"});
            res.send({response: errors[0].message});
        }
    }
}

module.exports={SignUp}