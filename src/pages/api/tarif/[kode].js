import checkCookieMiddleware from "@/pages/api/middleware";
import TarifPacking from "@/models/TarifPacking";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                const barangId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                await TarifPacking.destroy({
                    where: {
                        kode: barangId
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "Tarif Packing deleted successfully"
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
                const barangId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                const newTarifPacking = req.body; // Anggap req.body berisi data pelanggan baru
                await TarifPacking.update(newTarifPacking,{
                    where: {
                        kode : barangId
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
