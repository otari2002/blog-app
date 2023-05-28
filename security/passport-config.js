const LocalStrategy = require('passport-local').Strategy;
const prisma = require('../prisma/prismaClient');
const bcrypt = require('bcrypt');


function initializePassport(passport){     
    passport.use(
        new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { name: username },
            });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
            
        } catch (error) {
            return done(error);
        }
        })
    );

    // Configure Passport.js to store the user ID in the session
    passport.serializeUser((user, done) => {
        done(null, user.name);
    });

    // Configure Passport.js to retrieve the user from the database based on the ID stored in the session
    passport.deserializeUser(async (username, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { name: username },
        });
        done(null, user);
    } catch (error) {
        done(error);
    }
    })
}

module.exports = initializePassport;