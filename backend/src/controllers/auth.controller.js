import { generateToken } from "../lib/generateToken.js";

export const signup = async (req, res) => {
    try {
        const {email, name, password} = req.body;
        if(!email || !name || !password) return res.status(400).json({message: "Missing Credentials"});
    } catch (error) {
        
    }
}