import checkCookieMiddleware from "@/pages/api/middleware";
import BarangSegment from "@/models/BarangSegment";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const barangSegment = await BarangSegment.findAll()
                res.status(200).json({
                    ok : true,
                    data : barangSegment
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
                const barangSegment = await BarangSegment.create(newBarang);
                res.status(201).json({
                    ok: true,
                    data: barangSegment
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
