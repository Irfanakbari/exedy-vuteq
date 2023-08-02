import Customer from "@/models/Customer";
import checkCookieMiddleware from "@/pages/api/middleware";
import BarangType from "@/models/BarangType";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const barangType = await BarangType.findAll()
                res.status(200).json({
                    ok : true,
                    data : barangType
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
                const barangType = await BarangType.create(newBarang);
                res.status(201).json({
                    ok: true,
                    data: barangType
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
