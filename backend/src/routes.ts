import { Router } from "express";

import userRoutes from "../src/modules/userManagement/routes/userRoutes";

const router = Router();

router.use("/user", userRoutes);

export default router;