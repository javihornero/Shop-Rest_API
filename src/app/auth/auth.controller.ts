import { Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config/environment';

import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import * as HttpCode from 'http-status-codes';

@Service()
export class AuthController {

    constructor(private userService: UserService){}

    //login
    async auth(req, res){

        const {email,password} = req.body;

        // console.log("AUTHENTICATION: " ,email);

        if( !email ) return res.status(HttpCode.BAD_REQUEST).send("email field is missing");

        let userlog: User | null;
      
        userlog = await this.userService.findByEmail(email);
        if(userlog && userlog.password === password){

            //load the payload to be included in the jwt
            const payload = {
                id: userlog.id,
                user: userlog.name,
                email: userlog.email,
                rol: userlog.rol
            };

            //token assigned in config. Avoids identity thief. Hashes the token with the private key.
            const token = jwt.sign(payload, config.secretJwt);
            res.status(HttpCode.OK).json({'jwt': token});
            
        }
        else {
            //status code: 401 = Unauthorized
            res.status(HttpCode.UNAUTHORIZED).send("Your email or password are wrong");
        }

    }

    //check if the user has logged in
    public verifyApiRequest(req, res, next){

        const token = req.headers['access-token'];
        
        if(token){
            //check the validation of the token
            jwt.verify(token, config.secretJwt, (err, decoded) => {
                if(err){
                    res.status(HttpCode.UNAUTHORIZED).json({
                        message: 'Wrong token'
                    });
                }
                else {
                    req.user = decoded;
                    next();
                }
            });
        }
        else {
            res.status(HttpCode.UNAUTHORIZED).json({
            message: 'Invalid token'
            });
        }
    }

    public getToken(username,userId = "hola",rol = "user"){
        const userObj = {"user":username , "id":userId , "rol":rol};
        return jwt.sign(userObj, config.secretJwt);
    }

    public getTokenUser(user:User){
        const userObj = {"user":user.name , "id":user.id , "rol":user.rol};
        return jwt.sign(userObj, config.secretJwt);
    }

}

export function verifyAdmin(req,res,next){

    //console.log("Verifying Admin: ",req.user);
    if( req.user.rol !== "admin" ) return res.status(HttpCode.FORBIDDEN).send('Access denied. Need admin permission.');

    next();
}

/**Checks if the requester is a store.*/
export function verifyStore(req,res,next){

    if( req.user.rol !== "store" ) return res.status(HttpCode.FORBIDDEN).send('Access denied. Only stores.');

    next();
}

/**Checks if the requester is a normal user.*/
export function verifyUser(req,res,next){
    
    if( req.user.rol !== "user" ) return res.status(HttpCode.FORBIDDEN).send('Access denied. Only normal users.');

    next();
}

/**Checks if the requester is a store or an admin.*/
export function verifyStoreAdmin(req,res,next){

    if( req.user.rol !== "admin" && req.user.rol !== "store") return res.status(HttpCode.FORBIDDEN).send('Access denied. Only stores or admin.');

    next();
}