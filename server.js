const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const Joi = require("joi");

const app = express();
const upload = multer({ dest: "uploads/" });

const dataSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required()
});

app.post("/import/json", upload.single("file"), (req, res) => {
  try {
    const rawData = fs.readFileSync(req.file.path);
    const jsonData = JSON.parse(rawData);

    const errors = [];
    jsonData.forEach((item, index) => {
      const { error } = dataSchema.validate(item);
      if (error) errors.push({ row: index + 1, error: error.details[0].message });
    });

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    res.json({ message: "JSON data imported successfully!", data: jsonData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    fs.unlinkSync(req.file.path);
  }
});


app.post("/import/csv", upload.single("file"), (req, res) => {
  const results = [];
  const errors = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      const { error } = dataSchema.validate(row);
      if (error) {
        errors.push({ row: row, error: error.details[0].message });
      } else {
        results.push(row);
      }
    })
    .on("end", () => {
      fs.unlinkSync(req.file.path);
      if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
      }
      res.json({ message: "CSV data imported successfully!", data: results });
    });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
