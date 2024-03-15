const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');


const jwt = require('jsonwebtoken');


// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootNu@123',
  database: 'newUniEffApp',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get('/api/data', (req, res) => {
  const query = 'SELECT * FROM efficiency';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


app.use(bodyParser.json());

// API Endpoint to Insert Data
// app.post('/efficiency', (req, res) => {
//   const data = req.body;

//   // Assuming 'efficiency' is your table name
//   const query = 'INSERT INTO efficiency SET ?';

//   db.query(query, data, (err, result) => {
//     if (err) {
//       console.error('Error inserting data:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       console.log('Data inserted successfully:', result);
//       res.status(201).json({ message: 'Data inserted successfully' });
//     }
//   });
// });


//=====Insert Data end point by setting the time to zero.

app.post('/efficiency', (req, res) => {
  let data = req.body;

  // Convert data.date to a Date object if it's not already one
  if (!(data.date instanceof Date)) {
    data.date = new Date(data.date);
  }

  // Set the time part of the date to zero
  data.date.setHours(0, 0, 0, 0);

  // Assuming 'efficiency' is your table name
  const query = 'INSERT INTO efficiency SET ?';

  db.query(query, data, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Data inserted successfully:', result);
      res.status(201).json({ message: 'Data inserted successfully' });
    }
  });
});

//api to get all data with given date and branch id
app.get('/api/branchDate', (req, res) => {
  const { date, branchId } = req.query;

  // Check if both date and branchId are provided
  if (!date || !branchId) {
    return res.status(400).json({ error: 'Both date and branchId are required.' });
  }

  // Create a MySQL query to fetch data based on date and branchId
  const query = 'SELECT * FROM efficiency WHERE DATE(date) = ? AND branch_id = ?';
  // Execute the query with parameters
  db.query(query, [date, branchId], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//get data for summerIncome as given factory and month
app.get('/api/efficiency', (req, res) => {
  const { branchId, month } = req.query;
  console.log(branchId);
  console.log(month);

  // Check if both factory and month are provided
  if (!branchId || !month) {
    return res.status(400).json({ error: 'Both factory and month are required.' });
  }

  // Ensure two digits for month
  const formattedMonth = month.toString().padStart(2, '0');

  // Create a MySQL query to fetch data based on factory and month
  const query = 'SELECT * FROM efficiency WHERE branch_id = ? AND MONTH(date) = ?';

  // Execute the query with parameters
  db.query(query, [branchId, formattedMonth], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

 //===================New Version With hourly Data update of the app APIS=============================//

 //insert data to the dailyFigures table

 app.post('/dailyfigures', (req, res) => {
  let data = req.body;

  // Convert data.date to a Date object if it's not already one
  if (!(data.date instanceof Date)) {
    data.date = new Date(data.date);
  }

  // Set the time part of the date to zero
  data.date.setHours(0, 0, 0, 0);

  // Assuming 'daily_figures' is your table name
  const query = 'INSERT INTO daily_figures SET ?';

  db.query(query, data, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Data inserted successfully:', result);
      res.status(201).json({ message: 'Data inserted successfully' });
    }
  });
});

//get all DailyFigures API

app.get('/api/dailyfigures', (req, res) => {
  const query = 'SELECT * FROM daily_figures';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


//get dailyfigures based on Line and factory
app.get('/api/dailyfiguresbylinedatefactory', (req, res) => {
  const { lineNo,date,factory } = req.query;
  
  console.log(lineNo);
  console.log(date);
   

  // Check if both factory and month are provided
  if (!lineNo || !date || !factory) {
    return res.status(400).json({ error: 'Line Number and Date is requried' });
  }

  // Ensure two digits for month
  

  // Create a MySQL query to fetch data based on factory and month
  const query = 'SELECT * FROM daily_figures WHERE line_no = ? AND  DATE(date) = ? AND branch_id=?';

  // Execute the query with parameters
  db.query(query, [lineNo,date,factory], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


//=====Testing for time disapble new feature====//

//get dailyFigures by lineDatea and style with //newlyadded factory
app.get('/api/dailyfiguresbylinedatenstylefactorylineNo', (req, res) => {
  const { lineNo,date,style,factory } = req.query;
  
  console.log(lineNo);
  console.log(date);
   

  // Check if both factory and month are provided
  if (!lineNo || !date || !style ||!factory) {
    return res.status(400).json({ error: 'Line Number and Date and style factory is required' });
  }

  // Ensure two digits for month
  

  // Create a MySQL query to fetch data based on factory and month
  const query = 'SELECT * FROM daily_figures WHERE line_no = ? AND  DATE(date) = ? AND style = ? AND branch_id=?';

  // Execute the query with parameters
  db.query(query, [lineNo,date,style,factory], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//add data to hourlyfigures table
app.post('/hourlyfigures', (req, res) => {
  let data = req.body;

  // Convert data.date to a Date object if it's not already one
  if (!(data.date instanceof Date)) {
    data.date = new Date(data.date);
  }

  // Set the time part of the date to zero
  data.date.setHours(0, 0, 0, 0);

  // Assuming 'daily_figures' is your table name
  const query = 'INSERT INTO hourly_figures SET ?';

  db.query(query, data, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Data inserted successfully:', result);
      res.status(201).json({ message: 'Data inserted successfully' });
    }
  });
});

//get all data from hourlyFigures
app.get('/api/hourlyfigures', (req, res) => {
  const query = 'SELECT * FROM hourly_figures';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//get  data from hourlyFigures based on date line and factory,style
 
app.get('/api/hourlyfiguresbylinedatefactorystyle', (req, res) => {
  const { lineNo,date,style,factory } = req.query;
  
  // console.log(lineNo);
  // console.log(date);
  // console.log(style);
  // console.log(factory);
   

  // Check if both factory and month are provided
  if (!lineNo || !date ||!style || !factory) {
    return res.status(400).json({ error: 'Line Number and Date,style,factory is requried' });
  }

  // Ensure two digits for month
  

  // Create a MySQL query to fetch data based on factory and month
  const query = 'SELECT * FROM hourly_figures WHERE line_no = ? AND  DATE(date) = ? && branch_id = ? AND  style = ?';

  // Execute the query with parameters
  db.query(query, [lineNo,date,factory,style], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


//api endpoint to get unique lines and style on the given date and factory

app.get('/api/linestylesbydatefactory', (req, res) => {
  const { date,factory } = req.query;
  
   
  // console.log(date);
   
  // console.log(factory);
   

  // Check if both factory and month are provided
  if (!date || !factory) {
    return res.status(400).json({ error: 'Date,factory is requried' });
  }

  // Ensure two digits for month
  

  // Create a MySQL query to fetch data based on factory and month
  //const query = 'SELECT * FROM hourly_figures WHERE line_no = ? AND  DATE(date) = ? && branch_id = ? AND  style = ?';
  const query = 'select distinct line_no,style from hourly_figures where DATE(date)=? && branch_id=? order by line_no,style';

  // Execute the query with parameters
  db.query(query, [date,factory], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//api endpoint to get the hourly data with time slots with data,factory,style,line
app.get('/api/hourlydataforviewtargetbydatefactorystyleline', (req, res) => {
  const { date,factory,style,lineNo } = req.query;
  
   
  // console.log(date);
   
  // console.log(factory);
  // console.log(style);
  // console.log(lineNo);
   

  // Check if both factory and month are provided
  if (!date || !factory ||!style ||!lineNo) {
    return res.status(400).json({ error: 'Date,factory,line,style is requried' });
  }

  // Ensure two digits for month
  

  // Create a MySQL query to fetch data based on factory and month
  //const query = 'SELECT * FROM hourly_figures WHERE line_no = ? AND  DATE(date) = ? && branch_id = ? AND  style = ?';
  const query = `
    SELECT hf.date, hf.branch_id, hf.line_no, hf.style, hf.hourqty, hf.hourslot, df.qty, df.mo, df.hel, df.iron, df.smv,df.forcast_pcs
    FROM hourly_figures hf
    JOIN daily_figures df ON hf.date = df.date AND hf.branch_id = df.branch_id AND hf.line_no = df.line_no AND hf.style = df.style
    WHERE hf.branch_id = ? AND DATE(hf.date) = ? AND df.line_no = ? AND df.style = ?
    ORDER BY hf.hourslot;
  `;

  // Execute the query with parameters
  db.query(query, [factory, date, lineNo, style], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


//==========APIS for hourly filling ui which blocks the already completed Styles and line from efficiency Table=========//

//api for get styles which is given line date and factory.
app.get('/api/stylescompletedbylinedatefactory', (req, res) => {
  const { lineNo,date,factory } = req.query;
  
  // console.log(lineNo);
  // console.log(date);
  // console.log(style);
  // console.log(factory);
   

  // Check if both factory and month are provided
  if (!lineNo || !date ||!factory) {
    return res.status(400).json({ error: 'Line Number and Date,factory is requried' });
  }

  // Ensure two digits for month
  

  // Create a MySQL query to fetch data based on factory and month
  //const query = 'SELECT * FROM hourly_figures WHERE line_no = ? AND  DATE(date) = ? && branch_id = ? AND  style = ?';
  const query = 'select style from efficiency where line_no=? and date=? and branch_id=?';

  // Execute the query with parameters
  db.query(query, [lineNo,date,factory], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});




//==================Monthly Income APIS======================//

//api for insert data to monlty income
app.post('/monthlyIncome', (req, res) => {
  let data = req.body;

  // Convert data.date to a Date object if it's not already one
  

  // Set the time part of the date to zero
  //data.date.setHours(0, 0, 0, 0);
  console.log(data);

  // Assuming 'daily_figures' is your table name
  const query = 'INSERT INTO monthly_target (branch_id, inc_month, inc_year, income, w_days) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [data.branch_id, data.inc_month, data.inc_year, data.income, data.w_days], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Data inserted successfully:', result);
      res.status(200).json({ message: 'Data inserted successfully' });
    }
  });
});

//get all data from monthly Income
app.get('/api/monthlytarget', (req, res) => {
  const query = 'SELECT * FROM monthly_target';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

//get monlthly income based on factory and year
app.get('/api/monthlyIncomebyfactoryyear', (req, res) => {
  const { factory,year } = req.query;
   
  
  // Check if both factory and month are provided
  if (!factory ||  !year) {
    return res.status(400).json({ error: 'Year or factory is required' });
  }
  
  
  
  // Construct the SQL query to fetch data based on factory and month
  const query = `SELECT *
  FROM monthly_target
  WHERE branch_id =? AND inc_year = ?`;

  // Execute the SQL query with parameters
  db.query(query, [factory,year], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


//api for get data from montly income by factory and month and year
app.get('/api/monthlyIncomebyfactorymonthyear', (req, res) => {
  const { factory, month,year } = req.query;
  console.log(factory);
  console.log(month);
  
  // Check if both factory and month are provided
  if (!factory || !month || !year) {
    return res.status(400).json({ error: 'Month or factory is required' });
  }
  
  // Ensure two digits for month (e.g., '01' instead of '1')
  const formattedMonth = month.padStart(2, '0');
  
  // Construct the SQL query to fetch data based on factory and month
  const query = `SELECT income,w_days
  FROM monthly_target
  WHERE branch_id =? AND inc_month = ? AND inc_year = ?`;

  // Execute the SQL query with parameters
  db.query(query, [factory, formattedMonth,year], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});



//get dailyIncome from monthly Input from efficiency Table. 
app.get('/api/efficiencyincomedailysumbymonthfactory', (req, res) => {
  const { factory, month } = req.query;
  console.log(factory);
  console.log(month);
  
  // Check if both factory and month are provided
  if (!factory || !month) {
    return res.status(400).json({ error: 'Month or factory is required' });
  }
  
  // Ensure two digits for month (e.g., '01' instead of '1')
  const formattedMonth = month.padStart(2, '0');
  
  // Construct the SQL query to fetch data based on factory and month
  const query = `
    SELECT 
      DATE_FORMAT(date, '%Y-%m-%d') AS \`Date\`,
      SUM(income) AS \`Total Income\`
    FROM 
      efficiency
    WHERE 
      branch_id = ? AND
      MONTH(date) = ?
    GROUP BY 
      DATE_FORMAT(date, '%Y-%m-%d')
    ORDER BY 
      \`Date\` ASC;`;

  // Execute the SQL query with parameters
  db.query(query, [factory, formattedMonth], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


//=====================User API LIST ==========================//


app.post('/register', async (req, res) => {
  console.log(req.body);
  const { email, password, first_name, last_name, factory } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !first_name || !last_name || !factory) {
    return res.status(400).json({ error: 'All fields are required for registration.' });
  }

  try {
    // Check if the user with the provided email already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking user:', checkErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // If the user already exists, inform the frontend
      if (checkResults && checkResults.length > 0) {
        return res.status(409).json({ error: 'User with this email already exists.' });
      }

      // Generate a random salt
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);

      // Hash the password with the generated salt
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a MySQL query to insert user data into the 'users' table
      const insertUserQuery = 'INSERT INTO users (email, password_hash, salt, first_name, last_name, factory) VALUES (?, ?, ?, ?, ?, ?)';

      // Execute the query with parameters
      db.query(insertUserQuery, [email, hashedPassword, salt, first_name, last_name, factory], (insertErr, result) => {
        if (insertErr) {
          console.error('Error registering user:', insertErr);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('User registered successfully:', result);
        return res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (error) {
    console.error('Error salting/hashing password:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



// API Endpoint to Get All Users
app.get('/api/users', (req, res) => {
  // Create a MySQL query to fetch all users
  const query = 'SELECT * FROM users';

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});
// ...

//validate login details api
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if all required fields are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Both email and password are required for login.' });
  }

  try {
    // Fetch user from the database based on the provided email
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const user = results[0];

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // If the password is valid, create a JWT token for authentication
      const token = jwt.sign({ userId: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });

      res.status(200).json({ token,expiresIn : 3600 });
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//==========get user to given email==========
app.get('/api/userFactory', (req, res) => {
  const email = req.query.email;

  // Check if the user ID is provided
  if (!email) {
    return res.status(400).json({ error: 'User Email is required.' });
  }

  // Create a MySQL query to fetch the factory of the user
  const query = 'SELECT factory FROM users WHERE email = ?';

  // Execute the query with parameters
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        // Send the factory as a JSON response
        res.json({ factory: results[0].factory });
      } else {
        // If no user is found with the given ID
        res.status(404).json({ error: 'User not found' });
      }
    }
  });
});

//API for delete given user from the db

app.delete('/deleteUser/:id', async (req, res) => {
  const userId = req.params.id;

  // Check if the user ID is provided
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required for deletion.' });
  }

  try {
    // Create a MySQL query to delete the user from the 'users' table
    const deleteUserQuery = 'DELETE FROM users WHERE id = ?';

    // Execute the query with parameters
    db.query(deleteUserQuery, [userId], (deleteErr, result) => {
      if (deleteErr) {
        console.error('Error deleting user:', deleteErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Check if any rows were affected
      if (result.affectedRows > 0) {
        console.log('User deleted successfully:', result);
        return res.status(200).json({ message: 'User deleted successfully' });
      } else {
        // If no rows were affected, the user with the given ID was not found
        return res.status(404).json({ error: 'User not found' });
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});