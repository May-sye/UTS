const express  = require ('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');


const app = express();
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'rahasiaSesiAnda',    
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }      
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'perpustakaan'
});

connection.connect((Err) => {
    if(Err){
        console.error("Terjadi Kesalahan koneksi", err.stack);
        return;
    }
    console.log("Koneksi berhasil dengan" + connection.threadId)
});

app.set('view engine', 'ejs');

//session
// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
        return res.status(400).send('Username dan password harus diisi.');
    }

    // Cek kredensial
    if (username === 'admin' && password === '12345') {
        req.session.user = { username };
        res.send('Login berhasil! Sesi dibuat.');
    } else {
        res.status(401).send('Login gagal! Username atau password salah.');
    }
});

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Gagal keluar. Silakan coba lagi.');
        }
        // Menghapus session dan mengarahkan kembali ke halaman login atau halaman yang diinginkan
        res.send('Anda telah berhasil keluar.');
    });
});

//routing (CRUD)

//read
app.get('/', (req, res)=>{
   const query = 'SELECT * FROM anggota';
});

//read anggota
app.get('/anggota', (req, res) => {
    const query  = 'SELECT * FROM anggota';
    connection.query(query, (err, results)=>{
        res.render('anggota', {anggota: results});
    })
});

//create
app.post('/add', (req, res)=>{
    const { nama_anggota, alamat, no_telp, email, tgl_join, status } = req.body;
    const query = 'INSERT INTO anggota (nama_anggota, alamat, no_telp, email, tgl_join, status) VALUES (?,?,?,?,?,?)';
    connection.query(query, [nama_anggota, alamat, no_telp, email, tgl_join, status], (err, result)=>{
        if(err) throw err;
        res.redirect('/anggota');
    });
});

//update
app.get('/edit/:id', (req,res)=>{
    const query= 'select * from anggota where id = ?';
    connection.query (query, [req.params.id], (err, result)=>{
        if(err) throw err;
        res.render('edit', {anggota: result[0]});
    });
});

app.post('/edit/:id', (req, res)=> {
    const { nama_anggota, alamat, no_telp, email, tgl_join, status } = req.body;
    const query = 'update anggota set nama_anggota = ?, alamat = ?, no_telp = ?, email = ?, tgl_join = ?, status = ? where id = ?';
    connection.query (query, [nama_anggota, alamat, no_telp, email, tgl_join, status, req.params.id], (err, result)=>{
        if(err) throw err;
        res.redirect('/');
    });
});





//delete
app.get('/delete/:id', (req, res) => {
    const { id } = req.params; 
    const query = 'DELETE FROM anggota WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan saat menghapus data anggota.');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Anggota tidak ditemukan.');
        }
        res.status(200).send('Anggota berhasil dihapus.');
    });
});

// read petugas
app.get('/petugas', (req, res) => {
    const query  = 'SELECT * FROM petugas';
    connection.query(query, (err, results)=>{
        res.render('petugas', {petugas: results});
    })
});

//create
app.post('/add', (req, res)=>{
    const { Nama_Petugas, Jabatan, Username, Password} = req.body;
    const query = 'INSERT INTO petugas (Nama_Petugas, Jabatan, Username, Password) VALUES (?,?,?,?,)';
    connection.query(query, [Nama_Petugas, Jabatan, Username, Password], (err, result)=>{
        if(err) throw err;
        res.redirect('/petugas');
    });
});

//update
app.get('/update/:id', (req, res) => {
    const { id } = req.params; 
    const { Nama_Petugas, Jabatan, Username, Password } = req.body; 
    const query = 'UPDATE petugas SET Nama_Petugas = ?, Jabatan = ?, Username = ?, Password = ? WHERE id = ?';
    connection.query(query, [Nama_Petugas, Jabatan, Username, Password, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan saat memperbarui data petugas.');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Petugas tidak ditemukan.');
        }
        res.status(200).send('Data petugas berhasil diperbarui.');
    });
});

//delete
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM petugas WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan saat menghapus data petugas.');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Petugas tidak ditemukan.');
        }
        res.status(200).send('Data petugas berhasil dihapus.');
    });
});

// read buku
app.get('/buku', (req, res) => {
    const query  = 'SELECT * FROM buku';
    connection.query(query, (err, results)=>{
        res.render('buku', {buku: results});
    })
});

//create
app.post('/add', (req, res)=>{
    const { Judul, penerbit_buku, genre} = req.body;
    const query = 'INSERT INTO buku (Judul, penerbit_buku, genre) VALUES (?,?,?,)';
    connection.query(query, [Judul, penerbit_buku, genre], (err, result)=>{
        if(err) throw err;
        res.redirect('/buku');
    });
});

//update
app.put('/update/:id', (req, res) => {
    const { id } = req.params; 
    const { Judul, penerbit_buku, genre } = req.body; 
    const query = 'UPDATE buku SET Judul = ?, penerbit_buku = ?, genre = ? WHERE id = ?';
    connection.query(query, [Judul, penerbit_buku, genre, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan saat memperbarui data buku.');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('buku tidak ditemukan.');
        }
        res.status(200).send('Data buku berhasil diperbarui.');
    });
});

//delete
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM buku  WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan saat menghapus data buku .');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('buku  tidak ditemukan.');
        }
        res.status(200).send('Data buku  berhasil dihapus.');
    });
});


app.listen(3000,()=> {
    console.log("Server Berjalan di port 3000, buka melalui http://localhost:3000")
});