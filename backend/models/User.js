const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/sqlite.db');

class User {
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static create(email, password) {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, email });
        }
      });
    });
  }
}

module.exports = User;