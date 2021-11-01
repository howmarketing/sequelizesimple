'use strict';

const express = require('express');

const routes = express.Router();
const UserController = require('./controllers/UserController');
const UsersPhoneNumbersController = require('./controllers/UsersPhoneNumbersController');
const TechController = require('./controllers/TechController');


routes.get('/', (req, res) => {
    return res.status(200).jsonp({ success: true, msg: 'Ok' });
});

//Retrive user list with they associated models (techs and users_phone_numbers).
routes.get('/api/users/list', async (req, res) => {
    try {
        return await executeAsyncAPIEndpointRouteCatchingErrorsAndInfinityLoope(req, res, UserController.getUsers);
    } catch (e) {
        console.log(`Route ${(req?.path || '/api/unknow')} Error:`, e);
        return res.status(500).jsonp({ success: false, msg: e.message });
    }
});

//Create an user
routes.post('/api/user/create', async (req, res) => {
    try {
        return await executeAsyncAPIEndpointRouteCatchingErrorsAndInfinityLoope(req, res, UserController.store);
    } catch (e) {
        console.log(`Route ${(req?.path || '/api/unknow')} Error:`, e);
        return res.status(500).jsonp({ success: false, msg: e.message });
    }
});

//Add some existent tech from techs table to user by user_id param 
routes.post('/api/user/:user_id/add/tech', async (req, res) => {
    try {
        return await executeAsyncAPIEndpointRouteCatchingErrorsAndInfinityLoope(req, res, UserController.addTech);
    } catch (e) {
        console.log(`Route ${(req?.path || '/api/unknow')} Error:`, e);
        return res.status(500).jsonp({ success: false, msg: e.message });
    }
});

//Retrive all users and yours associated techs, and could filter associated techs by query tech_name key-name with a keyword valu as tech name 
routes.get('/api/users/techs/list', async (req, res) => {
    try {
        return await executeAsyncAPIEndpointRouteCatchingErrorsAndInfinityLoope(req, res, UserController.getTechs);
    } catch (e) {
        console.log(`Route ${(req?.path || '/api/unknow')} Error:`, e);
        return res.status(500).jsonp({ success: false, msg: e.message });
    }
});

//Retrive all associated techs from user by user_id param, and could filter associated techs by query tech_name key-name with a keyword valu as tech name
routes.get('/api/user/:user_id/techs/list', async (req, res) => {
    try {
        return await executeAsyncAPIEndpointRouteCatchingErrorsAndInfinityLoope(req, res, UserController.getTechs);
    } catch (e) {
        console.log(`Route ${(req?.path || '/api/unknow')} Error:`, e);
        return res.status(500).jsonp({ success: false, msg: e.message });
    }
});


routes.post('/api/user/:user_id/create/phone', async (req, res) => {
    try {
        return await executeAsyncAPIEndpointRouteCatchingErrorsAndInfinityLoope(req, res, UsersPhoneNumbersController.store);
    } catch (e) {
        console.log('Route Error: /api/user-phone-number/create ', e);
        return res.status(500).jsonp({ success: false, msg: e.message });
    }
});

routes.get('/api/user/:user_id/phones/list', async (req, res) => {
    try {
        return await executeAsyncAPIEndpointRouteCatchingErrorsAndInfinityLoope(req, res, UsersPhoneNumbersController.getUserPhoneNumbers);
    } catch (e) {
        console.log('Route Error: /api/user-phone-numbers/:user_id/phone-numbers ', e);
        return res.status(500).jsonp({ success: false, msg: e.message });
    }
});

routes.post('/api/tech/create', async (req, res) => {
    try {
        return await executeAsyncAPIEndpointRouteCatchingErrorsAndInfinityLoope(req, res, TechController.store);
    } catch (e) {
        console.log('Route Error: ' + req.path + ' ', e);
        return res.status(500).jsonp({ success: false, msg: e.message });
    }
});
routes.get('/api/techs/list', async (req, res) => {
    try {
        return await executeAsyncAPIEndpointRouteCatchingErrorsAndInfinityLoope(req, res, TechController.listAll);
    } catch (e) {
        console.log('Route Error: ' + req.path + ' ', e);
        return res.status(500).jsonp({ success: false, msg: e.message });
    }
});



/**
 * @description Função responsável por executar uma rota API com os padrões de segurança e comunicação diante erros
 * @description Função recebe os parâmetros de req e res respectivamente sobre request e response da comunicação HTTP(S)
 *  Acrescentado o parâmetros RequestHandler sendo a função controller a ser executada pela rota requisetada.
 * @description De responsabilidade de execução, será executada a função passada por parâmetro RequestHandler de forma async
 *  transportando os parâmetros req e res respectivos ao request e response da comunicação HTTP(S) 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {(req:express.Request, res:express.Response)=>Promise<{success?:boolean;msg?:string;} & Record<string,any>>} RequestHandler 
 * @returns 
 */
async function executeAsyncAPIEndpointRouteCatchingErrorsAndInfinityLoope(req, res, RequestHandler) {
    const path = req.path;
    const requestBodyData = req?.body || {};
    let responsePromise = { success: false, msg: 'response promise message.', data: {} };
    try {

        try {
            responsePromise = await (async (req, res) => {
                return new Promise(async (resolve, reject) => {
                    const responseTimeOut = setTimeout(() => {
                        resolve({
                            success: false,
                            msg: 'Response time out for create user endpoint.',
                            data: {}
                        });
                    }, 8000);
                    try {
                        const response = await RequestHandler(req, res);
                        clearTimeout(responseTimeOut);
                        resolve({
                            success: true,
                            msg: 'Response recived.',
                            data: response
                        });
                    } catch (e) {
                        clearTimeout(responseTimeOut);
                        const errorMessage = e?.message || 'unknow message from executed controller function.';
                        console.log('Execute API resquest handler controller function error: ', e);
                        resolve({
                            success: false,
                            msg: 'Execute API resquest handler controller function error: ' + errorMessage,
                            data: {}
                        });
                    }
                });
            })(req, res);
        } catch (e) {
            const syntaxErrorMessage = 'Syntax promise executer API request handler error: ';
            console.log(syntaxErrorMessage, e);
            throw new error(syntaxErrorMessage);
        }

        if (process.env.ENV_MOD === 'DEV') {
            console.log('Route API -> responsePromise: ', responsePromise);
        }
        if (responsePromise?.success === false) {
            throw new Error(responsePromise?.msg || 'Unknow response message error');
        }
        return res
            .status((responsePromise.success ? 200 : 500))
            .jsonp(responsePromise);
    } catch (e) {
        console.log(path + '?endpoint:error ', e);
        return res
            .status(500)
            .jsonp({ success: false, msg: e.message, request_data: requestBodyData });
    }
}

module.exports = routes;