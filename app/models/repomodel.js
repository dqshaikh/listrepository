module.exports = (sequelize, Sequelize) => {
    const Repo = sequelize.define("repo", {
        owner_id: {
            type: Sequelize.INTEGER
      },
      repo_name: {
        type: Sequelize.STRING
      },
      repo_description: {
        type: Sequelize.STRING
      },
      rating: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      }
    });
  
    return Repo;
  };
  