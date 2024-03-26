const express = require('express');
const mysql = require("mysql");
const cors = require("cors")

const app = express()
const port = 3000

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello !')
})

app.get('/mapmarker', (req, res) => {
    res.sendFile('./index.html', {root: __dirname});
  });

app.get('/moremarker', (req, res) => {
    res.sendFile('./more_marker.html', {root: __dirname});
  });

app.get('/markercluster', (req, res) => {
    res.sendFile('./marker_cluster.html', {root: __dirname});
  });

app.get('/polyline', (req, res) => {
    res.sendFile('./polyline.html', {root: __dirname});
  });

app.get('/routing', (req, res) => {
    res.sendFile('./routing.html', {root: __dirname});
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// konek ke database sql
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_2105551118",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.get("/getData", (req, res) => {
  const sql = "SELECT * FROM tb_rs";

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log("Data from MySQL:");
    console.log(results);

    res.json(results);
  });
});


app.get("/getImage/:id_rs", (req, res) => {
  const id = req.params.id_rs;
  const sql = "SELECT gambar_rs FROM tb_rs WHERE id_rs = ?";

  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("Image not found");
      return;
    }

    res.send(results[0].gambar_rs);
  });
});

app.post("/process", (req, res) => {
  const { nama_rs, latlng_rs, gambar_rs, alamat_rs } = req.body;

  if (!nama_rs || !latlng_rs || !gambar_rs || !alamat_rs) {
    res.status(400).send('Data tidak lengkap');
    console.log('Data yang diterima:', req.body);
    return;
  }

  const sql = `INSERT INTO tb_rs (nama_rs, latlng_rs, gambar_rs, alamat_rs) VALUES (?, ?, ?, ?)`;
  const values = [nama_rs, latlng_rs, gambar_rs, alamat_rs];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log("Data inserted into database");
    console.log('Data yang diterima:', req.body);
    res.send("Data inserted into database");
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});