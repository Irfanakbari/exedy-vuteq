import checkCookieMiddleware from "@/pages/api/middleware";
import {Sequelize, where} from "sequelize";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {


                res.status(200).json({
                    data : "Oke"
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
            break;
    }
}
const protectedAPIHandler = checkCookieMiddleware(handler);

export default handler;
