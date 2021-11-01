'use strict';

const express = require('express');
const UsersPhoneNumbers = require('./../models/UsersPhoneNumbers');
const User = require('./../models/User');
module.exports = {
    
    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns 
     */
    async getUserPhoneNumbers(req, res){
        try{
            const {user_id} = req?.params || {user_id:0};
            if(isNaN(parseInt(user_id)) || parseInt(user_id) < 1){
                throw new Error('User id ('+(user_id.toString()+'')+') number not recognized');
            }
            try{
                const userAssociatingPhoneNumbersData = await User.findByPk(user_id, {
                    include:{association:'user_phone_numbers'}
                });
                return {success:true, msg:'User phone numbers founded!', item:userAssociatingPhoneNumbersData }
            }catch(e){
                console.log('getUserPhoneNumbers -> error: ', e);
                throw new error('User find by pk associating phone numbers error: '+e.message);
            }
        }catch(e){
            return {success:false, msg:'Fail to retrive phone numbers from user: '+e.message,item:{}}
        }
    },

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns 
     */
    async store(req, res) {
        const { user_id } = req?.params || {user_id:0};
        const { phone_country_code, phone_state_area_code, phone_number } = req?.body || {user_id:1, phone_country_code:55, phone_state_area_code:62, phone_number:'9 0000-0000' };
        const phoneNumberWithNineNumbers = ((phone_number+'').toString().length >=9 ? true : false);
        return new Promise(async (resolve, reject) => {
            try {
                try{
                    const userModel = await User.findByPk(user_id);
                    if(!userModel){
                        resolve({success:false, msg:`User not founded for id ${user_id}`, item:{}});
                    }
                }catch(e){
                    console.log('user findByPk error: ',e);
                    resolve({success:false, msg:`User find error: ${e.message}`, item:{}});
                }
                const createdUserPhoneNumberData = await UsersPhoneNumbers.create({
                     userId:user_id,
                     phoneCountryCode:phone_country_code,
                     phoneStateAreaCode:phone_state_area_code,
                     phoneNumber:phone_number,
                     phoneFormatedNumber:`+${phone_country_code} (${phone_state_area_code})${(phoneNumberWithNineNumbers ? ' 9 ' : ' ')}${(phone_number+'').slice((phoneNumberWithNineNumbers ? 1 : 0),(phoneNumberWithNineNumbers ? 5 : 4))}-${(phone_number+'').slice((phoneNumberWithNineNumbers ? 5 : 4),(phoneNumberWithNineNumbers ? 9 : 8))}`
                    });
                resolve({ success: true, msg: 'Success created user phone number!', item: createdUserPhoneNumberData });
            } catch (e) {
                resolve({
                    success: false,
                    msg: 'Create user phone number fails with follow catch response: ' + e.message,
                    item: { user_id, phone_country_code, phone_state_area_code, phone_number }
                });
            }
        });
    },
    async getUsersPhoneNumbers(req, res){
        return new Promise(async (resolve, reject) => {
            try {
                const usersPhoneNumbers = await UsersPhoneNumbers.findAll();
                resolve({ success: true, msg: 'Success find users!', items: usersPhoneNumbers });
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