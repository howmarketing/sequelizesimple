'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users_phone_numbers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  users_phone_numbers.init({
    user_id: DataTypes.INTEGER,
    phone_country_code: DataTypes.INTEGER,
    phone_state_area_code: DataTypes.INTEGER,
    phone_number: DataTypes.INTEGER,
    phone_formated_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users_phone_numbers',
  });
  return users_phone_numbers;
};