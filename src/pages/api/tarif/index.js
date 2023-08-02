import checkCookieMiddleware from "@/pages/api/middleware";
import TarifPacking from "@/models/TarifPacking";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const tarifPacking = await TarifPacking.findAll()
                res.status(200).json({
                    ok : true,
                    data : tarifPacking
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
                const newTarif = req.body; // Anggap req.body berisi data pelanggan baru
                const tarifPacking = await TarifPacking.create(newTarif);
                res.status(201).json({
                    ok: true,
                    data: tarifPacking
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
