const { Router } = require("express");
const research = require("../controllers/research.controller");

const router = Router();

router.get("/health", research.getHealth);
router.get("/findings", research.getFindings);
router.get("/statistics", research.getStatistics);
router.get("/details", research.getDetails);
router.get("/charts", research.getCharts);

module.exports = router;
