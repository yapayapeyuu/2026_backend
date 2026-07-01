/* Generar el modelo de mongoose de workspace  */
import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            default: 'Nota'
        },
        descripcion: {
            type: String,
            required: false,
            default: ''
        },
        estado: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    {
        timestamps: {
            createdAt: 'fecha_creacion',
            updatedAt: 'fecha_actualizacion'
        }
    }
)

/* const workspaceSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        default: 'Nota'
    },
    descripcion: {
        type: String,
        required: false,
        default: ''
    },
    fecha_creacion: {
        type: Date,
        required: true,
        default: Date.now()
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    }
}) */
export const WORKSPACE_COLLECTION_NAME = "Workspace"
const Workspace = mongoose.model(WORKSPACE_COLLECTION_NAME, workspaceSchema);
export default Workspace

/* const noteSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        default: 'Nota'
    },
    contenido: {
        type: String,
        required: false,
        default: ''
    },
    fecha_creacion: {
        type: Date,
        required: true,
        default: Date.now
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    }
})

export const NOTE_COLLECTION_NAME = 'Note'
const Note = mongoose.model(NOTE_COLLECTION_NAME, noteSchema)

export default Note */