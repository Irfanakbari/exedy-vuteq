import connection from "@/config/database";
import {DataTypes} from "sequelize";
import { v4 as uuidv4 } from 'uuid';


const User = connection.define('User', {
    // Model attributes are defined here
    id: {
        type: DataTypes.STRING,
        defaultValue: () => uuidv4(),
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'admin'
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


export default User;