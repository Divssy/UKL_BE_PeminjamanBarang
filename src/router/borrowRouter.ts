import { Router } from "express";
import { verifyToken } from "../middleware/authorization";
import { createValidation, returnValidation, usageValidation } from "../middleware/borrowValidation";
import { analyzeItemUsage, analyzeUsage, createBorrow, returnItem } from "../controller/borrowController";
import authorizeAdmin from "../middleware/authorizeAdmin";

const router = Router()

router.post(`/inventory/borrow`, [verifyToken, createValidation], createBorrow)
router.post("/inventory/return", [verifyToken, returnValidation], returnItem);
router.post(`/inventory/usage-report`, [verifyToken, authorizeAdmin, usageValidation], analyzeUsage)
router.post(`/inventory/borrow-analysis`, [verifyToken, authorizeAdmin], analyzeItemUsage);

export default router