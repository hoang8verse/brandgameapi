const { DataTypes } = require('sequelize');
const dbConfig = require('@root/dbconfig')
const sequelize = dbConfig.sequelize;


const LB_ARShooter = sequelize.define('lb_arshooters', {
  // Model attributes are defined here
  user_app_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  score: {
    type: DataTypes.NUMBER,
    allowNull: false
  },

}, {
  // Other model options go here
});


const LB_ARShooterModel = () => {
  return LB_ARShooter;
}
module.exports = {
  LB_ARShooterModel,
}