import express from 'express';
import {
    createReport,
    getReportById,
    getReportCreatedToday
} from '../service/reportService.js';
import path from "node:path";

const router = express.Router();

router.use(express.json());

router.param('id', async (req, res, next, id) => {
    const reportId = Number(id);
    if (isNaN(reportId)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    try {
        const report = getReportById(reportId);
        if (!report) {
            return res.status(404).json({ error: `Report ${id} not found` });
        }
        req.report = report;
        req.reportId = reportId;
        next();
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/reports', async (req, res) => {
    const report = getReportCreatedToday();

    if (!report || req.body?.force === true) {
        try {
            const { id, file } = await createReport();
            return res.status(201).json({ id, file });
        } catch (error) {
            return res.status(500).json({ error: 'No se pudo generar el reporte'});
        }
    }
    
    return res.status(200).json({ id: report.id, file: `/reports/${report.id}/file`});
});

router.get('/reports/:id', (req, res) => {
    res.json(req.report);
});

router.get('/reports/:id/file', (req, res) => {
    const filePath = path.join(import.meta.dirname, "..", "..", req.report.path);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ error: "Archivo no encontrado" });
        }
    });
});

export default router;