import checkCookieMiddleware from "@/pages/api/middleware";
import BarangGroup from "@/models/BarangGroup";
import CustomerDetail from "@/models/CustomerDetail";
import {Op} from "sequelize";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const barangGroup = await BarangGroup.findAll()
                res.status(200).json({
                    ok : true,
                    data : barangGroup
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

                const lastBarangGroup = await BarangGroup.findAll();

                let nextId;
                if (lastBarangGroup.length > 0) {
                    const palletNumbers = lastBarangGroup.map(group => {
                        const palletId = group['kode'];
                        const numberString = palletId.split('G')[1];
                        return parseInt(numberString);
                    });

                    for (let i = 1; i <= lastBarangGroup.length + 1; i++) {
                        if (!palletNumbers.includes(i)) {
                            nextId = i;
                            break;
                        }
                    }

                    // Jika tidak ada urutan kosong, gunakan urutan terakhir + 1
                    if (!nextId) {
                        const lastNumber = Math.max(...palletNumbers);
                        nextId = lastNumber + 1;
                    }
                } else {
                    // Jika tidak ada valet sebelumnya, gunakan urutan awal yaitu 1
                    nextId = 1;
                }

                const nextIdFormatted = nextId.toString().padStart(3, '0');
                const palletKode =  'G' + nextIdFormatted;

                const barangGroup = await BarangGroup.create({
                    kode: palletKode,
                    name:newBarang.name,
                    keterangan:newBarang.keterangan
                });

                res.status(201).json({
                    ok: true,
                    data: barangGroup
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
