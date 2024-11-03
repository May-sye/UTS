const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

//render halaman regist
router.get('/regist',(req, res)=>{
    if (req.session.admins){
        return res.redirect('/auth/profile');
    }
    res.render('regist');
});

//proses register admins
router.post('/regist', (req, res)=>{
    const{username, password } = req.body;
    const hashedPassowrd = bcrypt.hashSync(password, 10);
    const query = "INSERT INTO admins (username, password) VALUES (?,?,?)";
    db.query(query, [username, password], (err, result)=>{
        if (err) throw err;
        res.redirect('/auth/login');
    });
});

//render halaman login
router.get ('/login', (req, res)=>{
    if (req.session.admins){
        return res.redirect('/auth/profile');
    }
    res.render('login');
});

//proses login admins
router.post('/login', (req, res)=>{
    const{ username, password } = req.body;
    const query = "SELECT * FROM admins WHERE username = ?";
    db.query(query, [username], (err, result)=> {
        if (err) throw err;
        if (result.length>0){
            const admins = result[0];
            if (bcrypt.compareSync(password, admins.password)){
                req.session.admins = admins;
                res.redirect('/auth/profile');
            } else {
                res.send('incorrect password');
            }
        } else {
            res.send('userno found');
        }
    });
});

//render halaman profil admin
router.get ('/profile', (req, res)=>{
    if (req.session.admins){
        res.render('profil', {admins: req.session.admins});
    } else{
        res.redirect('/auth/login');
    }
});

//proses logout 
router.get ('/logout', (req, res)=>{
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router;

