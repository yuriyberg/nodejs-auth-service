import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const database = {
    id: '123',
    username: 'dummy',
    email: 'dummy@gmail.com',
    password: '$2b$10$bn.9S9OKfZn/z4wrMegzke24/Covo1bsGJ7WVV.M2mhZrDD4PjBtS'
};

function connectDB() {
    console.log('database connected');
    return {
        findBy(username) {
            if (database['username'] === username) {
                return database
            } else {
                return null;
            }
        }
    }
}

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    const candidate = connectDB().findBy(username);

    if (candidate) {
        bcrypt.compare(password, candidate.password, (err, result) => {
            if (result) {
                const token = jwt.sign({email: candidate.email, id: candidate.id}, 'secret', {expiresIn: 10000});

                res.status(200).json({
                    token: `Bearer ${token}`,
                });
            } else {
                res.status(400).json({code: 'WRONG_CREDENTIALS', message: 'Invalid username or password'})
            }

        })
    } else {
        res.status(400).json({code: 'WRONG_CREDENTIALS', message: 'Invalid username or password'})
    }
});

app.listen(3000, () => {
    console.log('Services up at port 3000');
});
