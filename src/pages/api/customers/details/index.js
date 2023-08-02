import Customer from "@/models/Customer";
import checkCookieMiddleware from "@/pages/api/middleware";
import CustomerDetail from "@/models/CustomerDetail";
import {Op, where} from "sequelize";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const customerdetails = await CustomerDetail.findAll({
                    include:[Customer]
                })
                res.status(200).json({
                    ok : true,
                    data : customerdetails
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
                const { sub_name, customer } = req.body; // Anggap req.body berisi data pelanggan baru

                // Dapatkan kode terakhir yang digunakan dari database
                const lastCustomer = await CustomerDetail.findAll({
                    where: { kode: { [Op.like]: `${customer}%` }}
                });

                let nextId;
                if (lastCustomer.length > 0) {
                    const palletNumbers = lastCustomer.map(palet => {
                        const palletId = palet['kode'];
                        const numberString = palletId.slice(customer.length);
                        return parseInt(numberString);
                    });

                    for (let i = 1; i <= lastCustomer.length + 1; i++) {
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
                const palletKode =  customer + nextIdFormatted;

                // Gabungkan prefix dan angka increment yang sudah diformat

                const subCustomer = await CustomerDetail.create({
                    sub_name, customer, kode: palletKode
                });
                res.status(201).json({
                    ok: true,
                    data: subCustomer
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
