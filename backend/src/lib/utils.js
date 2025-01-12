import { secureHeapUsed } from 'crypto';
import jwt from 'jsonwebtoken';

//we are using jwt to generate a token ansd send it to the client in httpOnly cookie

//call this function to generate a token and send it to the client 
export const generateToken = (userId, res) => {

 const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
   expiresIn: "7d",
 })
 
  res.cookie("jwt", token, {
   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, Milliseconds
    httpOnly: true, //prevent XSS attacks cross-site scripting attacks, cookie is not accessible via client side js; so that the tokenb cannot be accessed using document.cookie or js
    sameSite: "strict", //CSRF attacks as the cookie is not sent in cross-origin requests
    secure: process.env.NODE_ENV !== "development", //cookie will only be sent over HTTPS` 
  })
};