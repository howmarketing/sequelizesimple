'use strict';
const express = require('express');
const { Op } = require('sequelize');
const User = require('./../models/User');
const Tech = require('./../models/Tech');
const UsersPhoneNumbers = require('../models/UsersPhoneNumbers');
module.exports = {
    async store(req, res) {
        const { name, email } = req?.body || { name: '', email: '' };
        return new Promise(async (resolve, reject) => {
            try {
                const createdUserData = await User.create({ name, email });
                resolve({ success: true, msg: 'Success created user!', item: createdUserData });
            } catch (e) {
                reject({
                    success: false,
                    msg: 'Create user fails with follow catch response: ' + e.message,
                    item: {}
                });
            }
        });
    },

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async getTechs(req, res) {
        try {
            const { user_id } = req?.params || {};
            const { tech_name } = req?.query || {};
            const userWhereClausule = user_id ? { id: user_id } : { id: { [Op.gte]: 1 } };
            const techWhereClausule = tech_name ? { name: { [Op.like]: `%${(tech_name + '').trim().split(' ').join('%')}%` } } : { id: { [Op.gte]: 1 } };
            const usersTechs = await User.findAll({
                where: userWhereClausule,
                order: [['name', 'DESC']],
                include: {
                    model: Tech,
                    as: 'techs',
                    where: techWhereClausule,
                    order: [['name', 'ASC']]
                }
            });
            return { success: true, msg: 'List user(s) techs founded', items: usersTechs };
        } catch (e) {
            return { success: false, msg: 'Get user(s) techs failed with: ' + e.message };
        }
    },
    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    async addTech(req, res) {
        try {
            //create consts values propertly
            const { user_id } = req?.params || {};
            const { tech_name } = req?.body || { tech_name: '' };

            //Get user model to add tech
            try {
                var userModel = await User.findByPk(user_id);
                if (!userModel) {
                    return { success: false, msg: `No user founded for id ${user_id}`, item: {} };
                }
                //return { success: true, msg: 'Test get user by id ' + user_id, item: userModel };
            } catch (e) {
                console.log('find user by id fail: ', e);
                throw new Error('Fail when try to get user model by id: ' + user_id + ' with error: ' + e.message);
            }

            //Get user model to add tech
            try {
                var techModel = await Tech.findOne({
                    where: { name: { [Op.like]: (tech_name + '').trim() } }
                });
                if (!techModel) {
                    return { success: false, msg: `No tech founded for name ${tech_name}`, item: {} };
                }
                //return { success: true, msg: 'Test get tech by name ' + tech_name, item: techModel };
            } catch (e) {
                console.log('find tech by name fail: ', e);
                throw new Error('Fail when try to get tech model by name: ' + tech_name + ' with error: ' + e.message);
            }

            //find tech already associated with user 
            try {
                const userTechsModel = await User.findOne(
                    {
                        attributes: [['id', 'user_id'], ['name', 'user_name'], ['email', 'user_email'], 'created_at', 'updated_at'],
                        where: { id: user_id },
                        include: [{
                            model: Tech,
                            as: 'techs',
                            attributes: [['id', 'tech_id'], ['name', 'tech_name'], 'created_at', 'updated_at'],
                            where: { id: techModel.id }
                        }]
                    });
                if (userTechsModel) {
                    return { success: false, msg: `User ${userModel.name} already have the ${techModel.name} tech associated with!` };
                }
                //return { success: true, msg: 'Test get user techs', item: userTechsModel };
            } catch (e) {
                console.log('find user techs', e);
                throw new Error('Fail when try to get user techs associating many: ' + e.message);
            }

            //Add tech to user relationship
            try {
                if (!('addTech' in userModel)) {
                    return { success: false, msg: `Rules for add tech to user was\`nt founded.`, item: {} };
                }
                const userAssociatedTech = await userModel["addTech"](techModel);

                console.log('userAssociatedTech: ', userAssociatedTech);

                return { success: true, msg: `The tech ${techModel.name} has been associated to user ${userModel.name}`, item: userAssociatedTech };
            } catch (e) {
                console.log('add tech to user fail: ', e);
                throw new Error(`Associate tech ${techModel.name} to user ${userModel.name} has been failed!`);
            }
        } catch (e) {
            return { success: false, msg: e.message };
        }
    },

    async getUsers(req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.findAll({
                    include: [
                        {
                            model: Tech,
                            as: 'techs'
                        },
                        {
                            model: UsersPhoneNumbers,
                            as: 'user_phone_numbers'
                        }
                    ]
                });
                resolve({ success: true, msg: 'Success find users!', items: users });
            } catch (e) {
                reject({
                    success: false,
                    msg: 'Find users fails with follow catch response: ' + e.message,
                    items: []
                });
            }
        });
    },
    async getUserById(req, res) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await User.findByPk('id', {});
                resolve({ success: true, msg: 'Success find users!', items: users });
            } catch (e) {
                reject({
                    success: false,
                    msg: 'Find users fails with follow catch response: ' + e.message,
                    items: []
                });
            }
        });
    }
}