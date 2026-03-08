const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            default: ''
        },
        permissions: {
            type: Array,
            default: []
        },
            // Audit fields
            createdBy: {
                id: { type: String, default: null },
                name: { type: String, default: '' }
            },
            updatedBy: {
                id: { type: String, default: null },
                name: { type: String, default: '' }
            },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        deletedAt: {
            type: Date,
            default: null
        }
    }
    , { timestamps: true });

const Role = mongoose.model('Role', roleSchema, 'roles'); // (Model name, Schema, Collection name)
module.exports = Role; 