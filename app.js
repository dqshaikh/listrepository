const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const http = require('http');
const cors = require('cors');
const request = require('request');
const axios = require('axios')
const path = require('path');
//const router = express.Router();
   
app.use(bodyParser.json());
   
/*--------------Database Connection-------------------*/
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root', /* MySQL User */
  password: 'Phpmyadmin@1', /* MySQL Password */
  database: 'git_db' /* MySQL Database */
});
   
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/view.html'));
  //__dirname : It will resolve to your project folder.
});



/**
 * Get Single Item
 *
 * @return response()
 */

app.get('/api/repos/:id',(req, res) => {
  var flag = '';
 
  var getheaders = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': 'token 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',
    'User-Agent': 'Fetch-api'

}; 
let avatar = '';
  async function makeRequest() {

    const config = {
        method: 'get',
        url: "https://api.github.com/users/" + req.params.id,
        headers: getheaders
    }
    try {
    let res = await axios(config)
    if(res.data.name !== null && res.data.name !== '') {
      avatar = res.data;
      return avatar;
    } else {
      return avatar;
    }
  } catch (err) {
    return avatar;
  }
// console.log(res.data);
 

    
}

makeRequest().then(avatar => {
  //console.log("subscription: ", avatar);
});

  let sqlQuery = "SELECT repo_name as fullname,repo_description as description,rating as rating, url as html_url FROM owner inner join repository on repository.owner_id=owner.id where name='"+ req.params.id+"'";
  let query = conn.query(sqlQuery, (err, results) => {
    //if(err) throw err;
    if (results  && results.length > 0){
    flag = 0;

    let sqlQueryuser = "SELECT image,followers,following,created_at,public_repos, owner_fullname as owner_fullname, name FROM owner where name='"+ req.params.id+"'";
    let queryres = conn.query(sqlQueryuser, (err, resultsuser) => {
      res.send(apiResponse(results,flag,resultsuser[0]));
    });

    
    } else {
         
      var options = {
        'method': 'GET',
        'url': "https://api.github.com/users/" + req.params.id + "/repos",
        'headers': getheaders
      };
      let data = '';
      request(options, function (error, response) {
        if (error) throw new Error(error);
        //var userdata = JSON.stringify(avatar);
        data = {name: req.params.id,image: avatar.avatar_url,followers: avatar.followers,following: avatar.following,created_at: avatar.created_at,public_repos: avatar.public_repos,owner_fullname:avatar.name};
        if(avatar === ''){
          res.send(apiResponse([],0,{}));
        } else {
        let sqlQueryInsert = "INSERT INTO owner SET ?";
        var ownerid = '';
        var array_name = [];
        let query = conn.query(sqlQueryInsert, data,(err, getResult) => {
         // if(err) throw err;
         
          ownerid = getResult.insertId;
          var parseval = JSON.parse(response.body);
          
          for(let i = 0; i < parseval.length; i++){ 
            var fullname = parseval[i].name;
            var description = parseval[i].description;
            var star = parseval[i].stargazers_url.length;
            var html_url = parseval[i].html_url;

            let datainsert = {owner_id: ownerid,repo_name: fullname,repo_description : description,rating: star,url: html_url};
            //console.log(datainsert);
            let sqlQueryInsertrepo = "INSERT INTO repository SET ?";
            
            let queryget = conn.query(sqlQueryInsertrepo, datainsert,(err, getResultRepo) => {
              if(err) throw err;
            });

            var newobj = {};

            newobj.fullname = fullname;
            newobj.description = description;
            newobj.html_url = html_url;
            newobj.rating = star;
            
            array_name.push(newobj);
            
            }
            flag = 1;
            res.send(apiResponse(array_name,flag,data));
        });
      }
        //console.log(response.body);
      });
    }
   });
  
});
      
  //let sqlQuery = "UPDATE items SET title='"+req.body.title+"', body='"+req.body.body+"' WHERE id="+req.params.id;
  
/**
 * API Response
 *
 * @return response()
 */
function apiResponse(results,flag,data){
    return JSON.stringify({"status": 200, "error": null,"flag":flag,'owner':data, "response": results});
}
   
/*-----------------Server listening---------------*/
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});