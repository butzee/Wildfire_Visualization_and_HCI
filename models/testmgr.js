var dbmgr = require('./dbmgr');
var db = dbmgr.db;

exports.getShapes = () =>{
    const sql = "SELECT * FROM fires LIMIT 10";
    let stmt = db.prepare(sql);
    let res = stmt.all();
    db.all(sql, (err, rows) => {
        rows.forEach(row => {
            console.log(row)
        });
    });
    return res;
}