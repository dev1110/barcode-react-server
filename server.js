const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '50.62.209.51',
      user : 'lata',
      password : 'clpl@123#',
      database : 'clpl_emp'
    }
  });
//   const knex = require('knex')({
//     client: 'mysql',
//     connection: {
//       host : '127.0.0.1',
//       user : 'root',
//       password : '',
//       database : 'clpl_emp'
//     }
//   });
//   knex.select('*').from('cost').then(data=>{
//       console.log(data);
//   });

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.post('/',(req,res)=>{
    const {mid, from, to}=req.body;
    knex.raw("SELECT `ename` as `name`,`eid` as `uid`,`barcode` as `cid`, \
    SUM(`coffee`) AS `coffee`, \
    SUM(`tea`) AS `tea`, \
    SUM(`d3`) AS `d3`, \
    SUM(`d4`) AS `d4`, \
    SUM(IF(`coffee` > `coffee_allowance`,`coffee` - `coffee_allowance`,0)*(SELECT `price` FROM `cost` WHERE `drink` = 'Coffee')) AS `coffee_cost`,\
    SUM(IF(`tea` > `tea_allowance`,`tea` - `tea_allowance`, 0) *(SELECT `price` FROM `cost` WHERE `drink` = 'Tea')) AS `tea_cost`,\
    SUM((IF(`coffee` > `coffee_allowance`,`coffee` - `coffee_allowance`, 0) *( SELECT `price` FROM `cost` WHERE `drink` = 'Coffee')) +(IF(`tea` > `tea_allowance`,`tea` - `tea_allowance`,0) *(SELECT `price` FROM `cost` WHERE `drink` = 'Tea'))) AS `total` \
    FROM `employees`  \
    WHERE `mid` LIKE '%"+ mid +"%' AND (`date` BETWEEN '"+ from +"' AND '"+ to +"') \
    GROUP BY `eid`,ename,barcode \
    ORDER BY `eid`")


// // knex.select('e.lastname', 'e.salary', subcolumn)
// // .from('employee as e')
// // .whereRaw('dept_no = e.dept_no')
// // Outputs:
// // select `e`.`lastname`, `e`.`salary`, (select avg(salary) from employee where dept_no = e.dept_no) avg_sal_dept from `employee` as `e` where dept_no = e.dept_no
//     knex.select({name:'ename'}, {uid: 'eid'}, {cid: 'barcode'})
//         .sum({ coffee: 'coffee', tea:'tea', d3:'d3', d4:'d4'})
//         .from('employees')
//         .groupBy('ename', 'eid', 'barcode')
//         .orderBy('eid')
    .then(data=>{
        if(data[0].length){
            console.log(data[0]);
            res.send(data[0]);
        }else{
            res.status(400).json('Not Found');
        }
    })
    .catch(err => res.status(400).json(err));
})
const PORT = process.env.PORT
app.listen(PORT||3000,()=>{
    console.log(`Running on port ${PORT}`)
});


// const http = require('http');
// const server  = http.createServer((req,res)=>{
//     console.log('method', req.method);
//     console.log('url', req.url);
//     const user = {
//         name:'Lata',
//         hobby:'Skating'
//     }
//     // res.setHeader('Content-Type','text/html');
//     res.setHeader('Content-Type','application/json');
//     // res.end('<h1> Hello</h1>');
//     res.end(JSON.stringify(user));
//     console.log('Heyyy!');
// })
// server.listen(3000);