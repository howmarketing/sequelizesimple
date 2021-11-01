const { Model, DataTypes, ModelCtor} = require('sequelize');
const Tech = require('./Tech');
const UsersPhoneNumbers = require('./UsersPhoneNumbers');


class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: DataTypes.STRING,
                email: DataTypes.STRING,
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
                sequelize
            }
        );
    }

    /**
     * 
     * @param {{[key: string]: ModelCtor<Model<any, any>>;}} models 
     */
    static associate(models) {
        this.hasMany(
            UsersPhoneNumbers,
            {
                foreignKey: 'user_id',
                as: 'user_phone_numbers'
            }
        );
        this.belongsToMany(Tech, { foreignKey: 'user_id', through:'users_techs', as: 'techs' });
    }
}

module.exports = User;