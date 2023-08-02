import checkCookieMiddleware from "@/pages/api/middleware";
import Bom from "@/models/Bom";
import BomBarang from "@/models/BomBarang";
import PackingList from "@/models/PackingList";
import BarangMaster from "@/models/BarangMaster";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const packingId = req.query.kode; // Anggap req.body.id berisi ID pelanggan yang akan dihapus

                const packingData = await PackingList.findByPk(packingId)

                const boms = await Bom.findByPk(packingData.bom, {
                    include: [
                        {
                            model: BomBarang,
                            include: [
                                {
                                    model: BarangMaster,
                                    attributes: ['name', 'satuan', 'assy_no', 'cust_part_no', 'kode'],
                                },
                            ],
                        },
                    ],
                });


                res.status(200).json({
                    ok : true,
                    data : boms['BomBarangs']
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
