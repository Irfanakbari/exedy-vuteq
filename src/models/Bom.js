import connection from "@/config/database";
import {DataTypes} from "sequelize";
import BarangMaster from "@/models/BarangMaster";
import Customer from "@/models/Customer";
import CustomerDetail from "@/models/CustomerDetail";
import BarangSatuan from "@/models/BarangSatuan";
import BarangType from "@/models/BarangType";
import BomBarang from "@/models/BomBarang";
import PackingList from "@/models/PackingList";


const Bom = connection.define('Bom', {
    // Model attributes are defined here
    kode: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    customer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sub_customer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    barang_jadi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    satuan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    assy_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cust_part_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'bom',
    timestamps:false
});

Customer.hasMany(Bom, {foreignKey:'customer'})
Bom.belongsTo(Customer, {foreignKey:'customer'})

CustomerDetail.hasMany(Bom, {foreignKey:'sub_customer'})
Bom.belongsTo(CustomerDetail, {foreignKey:'sub_customer'})

BarangType.hasMany(Bom, {foreignKey:'type'})
Bom.belongsTo(BarangType, {foreignKey:'type'})

BarangMaster.hasMany(Bom, {foreignKey:'barang_jadi'})
Bom.belongsTo(BarangMaster, {foreignKey:'barang_jadi'})

BarangSatuan.hasMany(Bom, {foreignKey:'satuan'})
Bom.belongsTo(BarangSatuan, {foreignKey:'satuan'})


Bom.hasMany(BomBarang, {foreignKey:'bom_id'})
BomBarang.belongsTo(Bom, {foreignKey:'bom_id'})

Bom.hasMany(PackingList, {foreignKey:'bom'})
PackingList.belongsTo(Bom, {foreignKey:'bom'})

export default Bom;