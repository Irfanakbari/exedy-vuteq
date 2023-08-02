import connection from "@/config/database";
import {DataTypes} from "sequelize";
import PackingList from "@/models/PackingList";


const Operator = connection.define('Operator', {
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
    tableName: 'operator',
    timestamps:false
});

Operator.hasMany(PackingList, {foreignKey:'operator'})
PackingList.belongsTo(Operator, {foreignKey:'operator'})

export default Operator;