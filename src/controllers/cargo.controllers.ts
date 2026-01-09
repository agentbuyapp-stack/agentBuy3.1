import { Request, Response } from "express";
import { Cargo } from "../models/cargoModel";

// POST /api/cargo
export const createCargo = async (req: Request, res: Response) => {
    try {
        const { name, description, phone, location, website } = req.body;

        const exists = await Cargo.findOne({ name });
        if (exists) {
            return res.status(409).json({ message: "Cargo name already exists" });
        }

        const cargo = await Cargo.create({
            name,
            description,
            phone,
            location,
            website,
        });

        return res.status(201).json(cargo);
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

// GET /api/cargo
export const getCargos = async (_req: Request, res: Response) => {
    try {
        const cargos = await Cargo.find().sort({ createdAt: -1 });
        return res.json(cargos);
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

// GET /api/cargo/:id
export const getCargoById = async (req: Request, res: Response) => {
    try {
        const cargo = await Cargo.findById(req.params.id);

        if (!cargo) {
            return res.status(404).json({ message: "Cargo not found" });
        }

        return res.json(cargo);
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

// PATCH /api/cargo/:id
export const updateCargo = async (req: Request, res: Response) => {
    try {
        const cargo = await Cargo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!cargo) {
            return res.status(404).json({ message: "Cargo not found" });
        }

        return res.json(cargo);
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE /api/cargo/:id
export const deleteCargo = async (req: Request, res: Response) => {
    try {
        const cargo = await Cargo.findByIdAndDelete(req.params.id);

        if (!cargo) {
            return res.status(404).json({ message: "Cargo not found" });
        }

        return res.json({ message: "Cargo deleted" });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};
