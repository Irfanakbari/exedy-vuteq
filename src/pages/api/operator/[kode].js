import checkCookieMiddleware from "@/pages/api/middleware";
import Operator from "@/models/Operator";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                const operatorId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                await Operator.destroy({
                    where: {
                        kode: operatorId
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "Operator deleted successfully"
                });
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error"
                });
            }
            break;
        case 'PUT':
            try {
                const operatorId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                const newOperator = req.body; // Anggap req.body berisi data pelanggan baru
                await Operator.update(newOperator,{
                    where: {
                        kode : operatorId
                    }
                });
                res.status(201).json({
                    ok: true,
                    data: "Success"
                });
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error"
                });
            }
            break;
    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;
