import checkCookieMiddleware from "@/pages/api/middleware";
import BarangSatuan from "@/models/BarangSatuan";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const barangSatuan = await BarangSatuan.findAll()
                res.status(200).json({
                    ok : true,
                    data : barangSatuan
                })
            } catch (e) {
                res.status(500).json({
                    ok : false,
                    data : "Internal Server Error"
                })
            }
            break;
        case 'POST':
            try {
                const newBarang = req.body; // Anggap req.body berisi data pelanggan baru
                const barangSatuan = await BarangSatuan.create(newBarang);
                res.status(201).json({
                    ok: true,
                    data: barangSatuan
                });
            } catch (e) {
                console.log(e.message);
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
