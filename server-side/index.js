import express from "express";
import cors from "cors";

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test-pelei",
  password: "admin",
  port: 5432,
});

const app = express();
app.use(cors());
app.use(express.json());


app.get('/edit/:id' , (req , res )=>{
      const id = req.params.id;
      console.log(id);
      const queryText = `SELECT * FROM employee WHERE mobileno = ${id}`;
      pool.query( queryText , (err , result )=>{
            if(err) return res.json({Message : "Error searching in server"})
            return res.json(result);
      }  )
} )

app.delete('/delete/:id' , (req , res )=>{

      const id = req.params.id;
      console.log(req.body.mobileno , "  ,  " , id );
      const q = `DELETE FROM employee WHERE mobileno = ${id}`;
      pool.query(q , (err , result) =>{
            if(err) return res.json({Message : "ERROR while deleting entry"})
            return res.json(result);
      })
} )

app.get('/' , (req , res)=>{
      const queryText  = "SELECT * FROM employee "
      pool.query( queryText , (err , result)=>{
            if(err){
                  return res.json({Message: "Error while fetching data"});
            }
            return res.json(result.rows);
      } )
} )

app.put('/update' , (req , res)=>{
      console.log(req.body);

      const id = req.body.employeeid;

const columns = Object.keys(req.body);
const values = Object.values(req.body);

const setClause = columns.map((column, index) => `${column} = $${index + 1}`).join(", ");

const queryText = `
  UPDATE employee
  SET ${setClause}
  WHERE employeeid = $${columns.length + 1}
`;
values.push(id);

pool.query(queryText, values, (err, result) => {
  if (err) {
    console.error("Error updating employee:", err);
    return res.json({ error: "Error updating employee" });
  }
  return res.json({ message: "Employee updated successfully" });
});

})

app.post('/addemployee' , (req , res)=>{
      console.log(req.body)

      const columns = Object.keys(req.body);
      const values = Object.values(req.body);
      
      const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
      
      const queryText = `
        INSERT INTO "employee"
        (${columns.join(", ")})
        VALUES
        (${placeholders})
      `;

      pool.query( queryText , values , (err , result)=>{
            if(err) return res.json(err);
            return res.json(result);
      } )

      // const querytext = "INSERT INTO employee ('name' , 'mobileno' , employeeid , address ) VALUES (?) "
      // console.log(req.body);
      // const values = [
      //       req.body.name,
      //       req.body.mobileno,
      //       req.body.employeeid,
      //       req.body.address
      // ]
      // pool.query(querytext , [values],  (err , result)=>{
      //       if(err) return res.json(err);
      //       return res.json(result);
      // } )

      // pool.end();
} )


app.listen(8080, () => {
  console.log("Listening");
});
