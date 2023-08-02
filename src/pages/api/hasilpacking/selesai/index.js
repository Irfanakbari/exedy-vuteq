import checkCookieMiddleware from "@/pages/api/middleware";
import HasilPacking from "@/models/HasilPacking";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            const packingId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus
            try {
                const hp = await HasilPacking.findAll({
                   where: {
                       no_packing : packingId
                   }
                })
                const totalQtyTerima = hp.reduce((total, item) => total + item.dataValues.qty_terima, 0);

                res.status(200).json({
                    ok : true,
                    data : totalQtyTerima
                })
            } catch (e) {
                res.status(500).json({
                    ok : false,
                    data : "Internal Server Error"
                })
            }
            break;
    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;
