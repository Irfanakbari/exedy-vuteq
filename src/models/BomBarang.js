import connection from "@/config/database";
import {DataTypes} from "sequelize";


const BomBarang = connection.define('BomBarang', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    bom_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    barang_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'bom_barang',
    timestamps:false
});






export default BomBarang;