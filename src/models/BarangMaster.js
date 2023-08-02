import connection from "@/config/database";
import {DataTypes} from "sequelize";
import BomBarang from "@/models/BomBarang";
import IncomingBarang from "@/models/IncomingBarang";
import PackingList from "@/models/PackingList";

const BarangMaster = connection.define('BarangMaster', {
    kode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
    },
    customer: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    customer_sub: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    satuan: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    segment: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    jenis: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    group: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    kpp1: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    kpp2: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    cust_part_no: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    assy_no: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0
    },
    target: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0
    },
    keterangan: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'master_barang',
    createdAt: 'createdAt',
    updatedAt: false
});

BarangMaster.hasMany(BomBarang, {foreignKey:'barang_id'})
BomBarang.belongsTo(BarangMaster, {foreignKey:'barang_id'})

BarangMaster.hasMany(IncomingBarang, {foreignKey:'barang_id'})
IncomingBarang.belongsTo(BarangMaster, {foreignKey:'barang_id'})

BarangMaster.hasMany(PackingList, {foreignKey:'barang_jadi'})
PackingList.belongsTo(BarangMaster, {foreignKey:'barang_jadi'})


export default BarangMaster