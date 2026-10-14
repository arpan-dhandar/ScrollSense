const { Router } = require("express");
const researchRoutes = require("./research.routes");

/**
 * Route aggregator.
 *
 * All feature route modules are mounted here under /api.
 * Add new feature routes (habits, goals, coach, etc.) below
 * as they are implemented.
 */
const router = Router();

router.use("/", researchRoutes);

// Future routes:
// router.use("/habits", habitRoutes);
// router.use("/goals", goalRoutes);
// router.use("/coach", coachRoutes);
// router.use("/focus-sessions", focusRoutes);

module.exports = router;
