import checkCookieMiddleware from "@/pages/api/middleware";
import BarangMaster from "@/models/BarangMaster";
import IncomingBarang from "@/models/IncomingBarang";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const bomId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus

                const boms = await IncomingBarang.findAll({
                    where: {
                        incoming_id : bomId
                    },
                    include: [BarangMaster]
                })
                res.status(200).json({
                    ok : true,
                    data : boms
                })
            } catch (e) {
                console.log(e.message)
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
