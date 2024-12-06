import { Router } from "express";
import { verifyToken } from "../middleware/authorization";
import { createItems, deleteItem, readItems, updateItem } from "../controller/itemController";
import { createValidation, updateValidation } from "../middleware/itemValidation";
import authorizeAdmin from "../middleware/authorizeAdmin";

const router = Router()

router.post('/inventory', [verifyToken, authorizeAdmin, createValidation], createItems)
router.get('/inventory/:id?', [verifyToken], readItems)
router.put('/inventory/:id', [verifyToken, authorizeAdmin, updateValidation], updateItem)
router.delete('/inventory/:id', [verifyToken, authorizeAdmin], deleteItem)

export default router