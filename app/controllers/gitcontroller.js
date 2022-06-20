const db = require("../models");
const Owner = db.owner;
const Repo = db.repo;
const Op = db.Sequelize.Op;
const axios = require('axios');

async function makeRequest(name) {
    var ownerDetail = [];
    try {
        var getheaders = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token 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',
            'User-Agent': 'Fetch-api'
        
        };

        const config = {
            method: 'get',
            url: 'https://api.github.com/users/'+name,
            headers: getheaders
        }
        let res = await axios(config);
        let data = '';
        if(res.data.name !== null && res.data.name !== '') {
            ownerDetail = res.data;
            
            data = {name: name,image: ownerDetail.avatar_url,followers: ownerDetail.followers,following: ownerDetail.following,repo_created_at: ownerDetail.created_at,public_repos: ownerDetail.public_repos,owner_fullname:ownerDetail.name};
           
          return data;
        } else {
          return ownerDetail;
        }
      } catch (err) {
        return ownerDetail;
        //console.log(err);
      }
}

async function makeRequestRepo(name,ownerid) {
    var array_name = [];
    try {
        var getheaders = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': 'token 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',
            'User-Agent': 'Fetch-api'
        
        };

        const config = {
            method: 'get',
            url: 'https://api.github.com/users/'+name+"/repos",
            headers: getheaders
        }
        let res = await axios(config);
        let datainsert = '';
        if(res.data.length > 0) {
            var parseval = res.data;
            for(let i = 0; i < parseval.length; i++){ 
                var fullname = parseval[i].name;
                var description = parseval[i].description;
                var star = parseval[i].stargazers_url.length;
                var html_url = parseval[i].html_url;
                var newobj = {};
                let datainsert = {owner_id: ownerid,repo_name: fullname,repo_description : description,rating: star,url: html_url};
                array_name.push(datainsert);
                Repo.create(datainsert)
                .then(data => {
                    //console.log(data);
                    
                });
               }
              // console.log(array_name);
            return array_name;
        } else {
            console.log("2222");
            return parseval;
        }
      } catch (err) {
        console.log("3333");
        return err;
      }
}


exports.findOne = (req, res) => {
  const name = req.params.name;
var flag = '';
Owner.findOne({ attributes: ['id','name', 'image', 'followers', 'following', 'repo_created_at', 'public_repos', 'owner_fullname'],where: { name: name } })
    .then(data => {
       
      if(data !== null && data !== '') {
        var uid = data.id;
        flag = 0;
        console.log("database");
        Repo.findAll({ attributes: ['owner_id', 'repo_name', 'repo_description', 'rating', 'url'],where: { owner_id: uid } })
    .then(repodata => {
        res.send(apiResponse(repodata,flag,data));
    });
        
      } else {
        
       var auth_token = makeRequest(name).then(ownerDetail => {
        flag = 1;
        if (ownerDetail.length <= 0) {
            res.send(apiResponse([],flag,{}));
          } else {

  
  Owner.create(ownerDetail)
    .then(data => {
        var uid = data.id;
        var auth_token = makeRequestRepo(name,uid).then(repoDetail => {
            res.send(apiResponse(repoDetail,flag,ownerDetail));
        });
        
    })
    .catch(err => {
        res.send(apiResponse([],flag,{}));
    });
        }
      });
      }
    })
    .catch(err => {
        
      res.status(500).send({
        message: "Error retrieving repo with name=" + name
      });
    });
};

function apiResponse(results,flag,data){
    return JSON.stringify({"status": 200, "error": null,"flag":flag,'owner':data, "response": results});
}
  