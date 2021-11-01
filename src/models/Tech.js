'use strict';
const { Model, DataTypes, Sequelize, ModelCtor } = require('sequelize');
const User = require('./User');

class Tech extends Model {
    /**
     * 
     * @param {Sequelize} sequelize 
     */
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    field: 'name'
                },
                createdAt: {
                    type: DataTypes.DATE,
                    field: 'created_at'
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    field: 'updated_at'
                }
            },
            {
                sequelize,
                modelName: 'techs',
                underscored: true,
                charset: 'utf8mb4',
                engine: 'InnoDB',
                collate: 'utf8mb4_unicode_ci'
            }
        );
    }
    /**
     * 
     * @param {{[key: string]: ModelCtor<Model<any, any>>;}} models 
     */
    static associate(models) {
        this.belongsToMany(models.User, { foreignKey: 'tech_id', through:'users_techs', as: 'users' });
    }
}

module.exports = Tech;