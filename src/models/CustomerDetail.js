import connection from "@/config/database";
import {DataTypes} from "sequelize";
import Customer from "@/models/Customer";
import BarangMaster from "@/models/BarangMaster";
import PackingList from "@/models/PackingList";


const CustomerDetail = connection.define('CustomerDetail', {
    // Model attributes are defined here
    kode: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    sub_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customer: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'customer_detail',
    createdAt: 'createdAt',
    updatedAt: false
});

Customer.hasMany(CustomerDetail, {foreignKey:'customer'})
CustomerDetail.belongsTo(Customer,{foreignKey:'customer'})

CustomerDetail.hasMany(BarangMaster, {foreignKey:'customer_sub'})
BarangMaster.belongsTo(CustomerDetail, {foreignKey:'customer_sub'})

CustomerDetail.hasMany(PackingList, {foreignKey:'sub_customer'})
PackingList.belongsTo(CustomerDetail,{foreignKey:'sub_customer'})

export default CustomerDetail;