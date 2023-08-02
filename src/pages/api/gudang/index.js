import checkCookieMiddleware from "@/pages/api/middleware";
import Gudang from "@/models/Gudang";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const gudang = await Gudang.findAll()
                res.status(200).json({
                    ok : true,
                    data : gudang
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
                const newGudang = req.body; // Anggap req.body berisi data pelanggan baru

                const lastGudang = await Gudang.findAll();

                let nextId;
                if (lastGudang.length > 0) {
                    const palletNumbers = lastGudang.map(group => {
                        const palletId = group['kode'];
                        const numberString = palletId.split('GD')[1];
                        return parseInt(numberString);
                    });

                    for (let i = 1; i <= lastGudang.length + 1; i++) {
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
                const gudangKode =  'GD' + nextIdFormatted;

                const barangGroup = await Gudang.create({
                    kode: gudangKode,
                    name:newGudang.name,
                    keterangan:newGudang.keterangan
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
