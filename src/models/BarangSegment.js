import connection from "@/config/database";
import {DataTypes} from "sequelize";
import BarangMaster from "@/models/BarangMaster";


const BarangSegment = connection.define('BarangSegment', {
    // Model attributes are defined here
    kode: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    keterangan: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'barang_segment',
    timestamps:false
});

BarangSegment.hasMany(BarangMaster, {foreignKey:'segment'})
BarangMaster.belongsTo(BarangSegment, {foreignKey:'segment'})

export default BarangSegment;