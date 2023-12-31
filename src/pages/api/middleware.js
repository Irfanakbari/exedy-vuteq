import {getCookie} from "cookies-next";
import jwt from "jsonwebtoken";
import User from "@/models/User";

const checkCookieMiddleware = (handler) => async (req, res) => {
    const cookies = getCookie('@vuteq-token-exedy', { req, res });
    const decoded = jwt.verify(cookies, 'vuteqcorp');

    const user = await User.findOne({
        where: {
            id: decoded.id,
        },
        attributes:{
            exclude: ['password']
        }
    })

    if (!decoded) {
        res.status(401).json({ error: 'Token Invalid' });
        return;
    } else {
        req.user = user
    }

    // Lakukan pengecekan cookie di sini, misalnya dengan memeriksa nama cookie atau isinya
    if (!cookies) {
        // Jika cookie tidak ada atau tidak valid, kirim tanggapan error atau lakukan tindakan yang sesuai
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    // Jika cookie valid, lanjutkan ke handler API
    return handler(req, res);
};

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '8mb',
        },
    },
}

export default checkCookieMiddleware