module.exports = (sequelize, Sequelize) => {
    const Owner = sequelize.define("owner", {
      name: {
        type: Sequelize.STRING
      },
      owner_fullname: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      followers: {
        type: Sequelize.INTEGER
      },
      following: {
        type: Sequelize.INTEGER
      },
      public_repos: {
        type: Sequelize.STRING
      },
      repo_created_at: {
        type: Sequelize.STRING
      }
    });
  
    return Owner;
  };
  