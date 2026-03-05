import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
  getBookStats,

} from "../controller/bookController.js";

const router = express.Router();
router.route("/")
  .post(protect, addBook)
  .get(protect, getBooks);
router.route("/stats")
  .get(protect, getBookStats);
router.route("/:id")
  .put(protect, updateBook)
  .delete(protect, deleteBook);

export default router;