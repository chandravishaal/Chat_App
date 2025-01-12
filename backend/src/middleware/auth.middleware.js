import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {

  try {
    const token = req.cookies.jwt;

    if(!token) {
      return res.status(401).json({status: 'error', message: 'Unauthorized- No token found'}); 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);// returns the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.

    if(!decoded) {
      return res.status(401).json({status: 'error', message: 'Unauthorized- Invalid token'});
    } 

    const user = await User.findById(decoded.userId).select('-password');// returns the user with the given id and select('-password') excludes the password field from the user object
    if(!user) {
      return res.status(404).json({status: 'error', message: 'User not found'});
    }

    req.user = user;//attaches the user object to the request object 

    next();//calls the next middleware in the stack

  } catch (error) {
    console.log('Error on protectRoute', error.message);
    res.status(500).json({status: 'error', message: 'Internal Server error'});    
  }

};