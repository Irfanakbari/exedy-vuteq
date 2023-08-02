import checkCookieMiddleware from "@/pages/api/middleware";
import BarangMaster from "@/models/BarangMaster";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                const barangId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                await BarangMaster.destroy({
                    where: {
                        kode: barangId
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "Barang Master deleted successfully"
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
                const newBarangMaster = req.body; // Anggap req.body berisi data pelanggan baru
                await BarangMaster.update(newBarangMaster,{
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
