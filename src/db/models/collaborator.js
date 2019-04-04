'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collaborator = sequelize.define('Collaborator', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  Collaborator.associate = function(models) {
    
    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE",
    });

    Collaborator.addScope("allCollabs", (wikiId) => {

      return {
        include: [{
          model: models.User
        }],
        where: {
          wikiId: wikiId
        },

        order: [
          ["updatedAt", "DESC"]
        ]
      };
    });
  };
  return Collaborator;
};