const Sequelize = require('sequelize');
const Op = Sequelize.Op;

'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "must be a valid email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });

    User.hasMany(models.Collaborator, {
      foreignKey: "userId",
      as: "collaborators",
    });

    User.addScope("allUsers", (wikiId) => {
      return {
        where: {
          role: {
            [Op.ne]: 2
          }
        },
        include: [{
          model: models.Collaborator, as: "collaborators",
          // where: {
          //   wikiId: wikiId
          // },
          required: false
        }],
      };
    });

  };


  return User;
};