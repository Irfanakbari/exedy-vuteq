import checkCookieMiddleware from "@/pages/api/middleware";
import Bom from "@/models/Bom";
import IncomingMaterial from "@/models/IncomingMaterial";
import BomBarang from "@/models/BomBarang";
import BarangMaster from "@/models/BarangMaster";

async function handler(req, res) {
    switch (req.method) {
        case 'DELETE':
            try {
                const barangId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                await IncomingMaterial.destroy({
                    where: {
                        kode: barangId
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: "Incoming Material deleted successfully"
                });
            } catch (e) {
                console.log(e);
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error"
                });
            }
            break;
        case 'GET':
            try {
                const barangId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
                const data = await Bom.findByPk(barangId,{
                    include: [
                        {
                            model: BomBarang,
                            include: [BarangMaster]
                        }
                    ]
                });
                res.status(200).json({
                    ok: true,
                    data: data
                });
            } catch (e) {
                console.log(e);
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
