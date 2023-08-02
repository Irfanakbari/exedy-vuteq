import checkCookieMiddleware from "@/pages/api/middleware";
import Operator from "@/models/Operator";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const operator = await Operator.findAll()
                res.status(200).json({
                    ok : true,
                    data : operator
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
                const newOperator = req.body; // Anggap req.body berisi data pelanggan baru

                const lastOperator = await Operator.findAll();

                let nextId;
                if (lastOperator.length > 0) {
                    const palletNumbers = lastOperator.map(group => {
                        const palletId = group['kode'];
                        const numberString = palletId.split('OP-')[1];
                        return parseInt(numberString);
                    });

                    for (let i = 1; i <= lastOperator.length + 1; i++) {
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
                const operatorKode =  'OP-' + nextIdFormatted;

                const barangGroup = await Operator.create({
                    kode: operatorKode,
                    name:newOperator.name,
                    keterangan:newOperator.keterangan
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
