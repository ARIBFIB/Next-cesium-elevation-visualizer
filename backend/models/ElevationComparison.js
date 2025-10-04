const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/sqlite.db');

class ElevationComparison {
  static create(userId, referencePoint, surroundingPoints, elevations) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO elevation_comparisons (user_id, reference_point, surrounding_points, elevations) VALUES (?, ?, ?, ?)',
        [userId, JSON.stringify(referencePoint), JSON.stringify(surroundingPoints), JSON.stringify(elevations)],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  }

  static findByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM elevation_comparisons WHERE user_id = ?', [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = ElevationComparison;