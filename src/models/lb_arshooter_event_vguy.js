const { DataTypes } = require('sequelize');
const dbConfig = require('@root/dbconfig')
const sequelize = dbConfig.sequelize;


const LB_ARShooter_Event = sequelize.define('lb_arshooters_event_vguys', {
  // Model attributes are defined here
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  score: {
    type: DataTypes.NUMBER,
    allowNull: false
  },

}, {
  // Other model options go here
});


const LB_ARShooterEventModel = () => {
  return LB_ARShooter_Event;
}
module.exports = {
  LB_ARShooterEventModel,
}