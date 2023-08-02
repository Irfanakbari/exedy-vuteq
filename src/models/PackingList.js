import {DataTypes} from "sequelize";
import connection from "@/config/database";
import HasilPacking from "@/models/HasilPacking";


const PackingList = connection.define('PackingList', {
    kode: {
        type: DataTypes.STRING(100),
        allowNull: true,
        primaryKey: true,
    },
    tanggal: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    customer: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    sub_customer: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    barang_jadi: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    qty_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    qty_selesai: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    qty_out: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    bom: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    cust_part_no: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    assy_no: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    explanner_no: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    mr_no: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    keterangan: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    operator: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
}, {
    tableName: 'packing_list',
    timestamps: false,
});


PackingList.hasMany(HasilPacking, {foreignKey:'no_packing'})
HasilPacking.belongsTo(PackingList, {foreignKey: 'no_packing'})



// Definisikan hubungan foreign key di sini jika diperlukan.

export default PackingList;
