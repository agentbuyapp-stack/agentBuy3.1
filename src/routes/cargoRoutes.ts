import { Router } from "express";
import {
    createCargo,
    getCargos,
    getCargoById,
    updateCargo,
    deleteCargo,
} from "../controllers/cargo.controllers";

const router = Router();

router.post("/", createCargo);
router.get("/", getCargos);
router.get("/:id", getCargoById);
router.put("/:id", updateCargo);
router.delete("/:id", deleteCargo);

export default router;
