const { Sequelize, Op, Model, DataTypes }  = require('sequelize');

const dbConfig = require('./../config/database');

const User = require('./../models/User');
const UsersPhoneNumbers = require('./../models/UsersPhoneNumbers');
const Tech = require('./../models/Tech');

const connection = new Sequelize(dbConfig);

User.init(connection);
UsersPhoneNumbers.init(connection);
Tech.init(connection);
UsersPhoneNumbers.associate(connection.models);
User.associate(connection.models);
Tech.associate(connection.models);