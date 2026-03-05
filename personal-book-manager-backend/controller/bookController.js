import Book from "../model/Book.js";

export const addBook = async (req, res, next) => {
  try {
    const { title, author, tags, status } = req.body;
    if (!title || !author) {
      res.status(400);
      throw new Error("Title and author required");
    }
    const book = await Book.create({
      user: req.user._id,
      title,
      author,
      tags,
      status,
    });
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

export const getBooks = async (req, res, next) => {
  try {
    const { status, tag, search, page = 1, limit = 5 } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: "i" };
    const skip = (page - 1) * limit;
    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // const total = await Book.countDocuments({ user: req.user._id });
    // const reading = await Book.countDocuments({
    //   user: req.user._id,
    //   status: "reading",
    // });
    // const completed = await Book.countDocuments({
    //   user: req.user._id,
    //   status: "completed",
    // });
   const totalFiltered = await Book.countDocuments(filter);
    res.json({
      // total,
      page: Number(page),
      totalPages: Math.ceil(totalFiltered / Number(limit)),
      data: books,
      // completed,
      // reading,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    if (book.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    if (book.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized");
    }
    await book.deleteOne();
    res.json({ message: "Book removed" });
  } catch (error) {
    next(error);
  }
};
export const getBookStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const total = await Book.countDocuments({ user: userId });

    const reading = await Book.countDocuments({
      user: userId,
      status: "reading",
    });

    const completed = await Book.countDocuments({
      user: userId,
      status: "completed",
    });

    const pending = await Book.countDocuments({
      user: userId,
      status: "pending",
    });
    res.json({
      total,
      reading,
      completed,
      pending,
    });
  } catch (error) {
    next(error);
  }
};