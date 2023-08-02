import checkCookieMiddleware from "@/pages/api/middleware";
import Gudang from "@/models/Gudang";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                const gudangId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                await Gudang.destroy({
                    where: {
                        kode: gudangId
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "Gudang deleted successfully"
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
                const gudangId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                const newGudang = req.body; // Anggap req.body berisi data pelanggan baru
                await Gudang.update(newGudang,{
                    where: {
                        kode : gudangId
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
