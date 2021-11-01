'use strict';
const express = require('express');
const Tech = require('./../models/Tech');
const User = require('./../models/User');
module.exports = {
    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns 
     */
    async store(req, res) {
        try {
            const { tech_name } = req?.body || { tech_name: '' };
            const createdTech = await Tech.create({
                name: tech_name
            });
            return { success: true, msg: 'Tech successfully created with name ' + tech_name, item: createdTech };
        } catch (e) {
            return { success: false, msg: 'Store tech fail: ' + e.message }
        }
    },
    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns 
     */
    async listAll(req, res) {
        try {
            const techs = await Tech.findAll(
                {
                    include:'users'
                }
            );
            return { success: true, msg: 'Tech list successfully founded with  ' + techs.length, items: techs };
        } catch (e) {
            return { success: false, msg: 'List techs fail: ' + e.message }
        }
    }
}

