import connection from "@/config/database";
import {DataTypes} from "sequelize";
import BarangMaster from "@/models/BarangMaster";
import IncomingMaterial from "@/models/IncomingMaterial";
import PackingList from "@/models/PackingList";


const Customer = connection.define('Customer', {
    // Model attributes are defined here
    kode: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    kontak: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    alamat: {
        type: DataTypes.TEXT
    },
    keterangan: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'customers',
    createdAt: 'created_at',
    updatedAt: false,
});

Customer.hasMany(BarangMaster, {foreignKey:'customer'})
BarangMaster.belongsTo(Customer, {foreignKey:'customer'})

Customer.hasMany(IncomingMaterial, {foreignKey:'customer'})
IncomingMaterial.belongsTo(Customer, {foreignKey:'customer'})

Customer.hasMany(PackingList, {foreignKey:'customer'})
PackingList.belongsTo(Customer,{foreignKey:'customer'})

export default Customer;