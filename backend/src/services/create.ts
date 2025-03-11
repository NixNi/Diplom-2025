import db from "./pool";

const query = db.query(`SELECT data FROM models WHERE name = tree`);
const result = query.get()
console.log(result)