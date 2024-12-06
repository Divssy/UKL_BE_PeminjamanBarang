import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient({errorFormat: "minimal"})

/** create */
const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {username, user_email, user_password} = req.body

        
        const findEmail = await prisma.user.findFirst({
            where: { user_email }
        })
        
        if(findEmail) {
            res.status(400).json({
                message: `Email has exists`
            })
            return
        }
        
        const hashedPassword = await bcrypt.hash(user_password, 10)

        const newUser = await prisma.user.create({
            data: {
                username,
                user_email,
                user_password: hashedPassword,
                user_role: `Member`
            }
        })

        res.status(200).json({
            message: `User has been created`,
            data: newUser
        })
        
        return

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

/** Read */
const readUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search?.toString() || null;

        const allData = await prisma.user.findMany({
            where: search
                ? {
                    OR: [{
                            username: { contains: search },
                        },
                        {
                            user_email: { contains: search },
                        }],
                    }
                : undefined, // Jika tidak ada search, tidak ada kondisi where
        });

        res.status(200).json({
            message: `User has been retrieved`,
            data: allData,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

/** Update */
const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {

        const id = req.params.id

        const findUser = await prisma.user
            .findFirst({
                where: { id: Number(id) }
            })

        if (!findUser) {
            return res.status(200)
                .json({
                    message: `Users is not found`
                })
        }

        const {
             username, user_password, user_role
        } = req.body

        const saveUser = await prisma.user
            .update({
                where: { id: Number(id) },
                data: {
                    username: username ? username : findUser.username,
                    user_password: user_password ? await bcrypt.hash(user_password, 12) : findUser.user_password,
                    user_role: user_role ? user_role : findUser.user_role
                }
            })

        return res.status(200)
            .json({
                message: `Users has been updated`,
                data: saveUser
            })
    } catch (error) {
        console.log(error)
        return res.status(500)
            .json(error)
    }
}

/** Delete */
const deleteUser = async (
    req: Request,
    res: Response
) : Promise<any> => {
    try {
        
        const id = req.params.id

        const findUsers = await prisma.user
            .findFirst({
                where: {id: Number(id)}
            })

        if (!findUsers){
            return res.status(200)
            .json({
                message: `Users is not found`
            })
        }

    
        const saveUsers= await prisma.user
            .delete({ 
                where: {id: Number(id)}
            })

        return res.status(200)
            .json({
                message: `Users has been removed`,
                data: saveUsers
        })
    } catch (error) {
        res.status(500)
            .json(error)
    }
}

const authentication = async (req: Request, res: Response) : Promise<any> => {
    try {
        const {username, user_password} = req.body
        /** check existing email */
        const findUser = await prisma.user.findFirst({
            where: {username}
        })

        if(!findUser){
            return res.status(400)
            .json({
                message: `Email is not registered`
            })
        }

        const isMatchPassword = await bcrypt.compare(user_password, findUser.user_password)

        if(!isMatchPassword){
            return res.status(200)
            .json({
                message: `Invalid password`
            })
        }

        const payload = {
            id: findUser?.id,
            username: findUser?.username,
            email: findUser?.user_email,
            UserRole: findUser?.user_role
        }

        const signature = process.env.SECRET || ``

        const token = jwt.sign(payload, signature)

        return res.status(200).json({
            status: "success",
            message: "Login Berhasil ",
            token,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

export { createUser, readUser, updateUser, deleteUser, authentication}