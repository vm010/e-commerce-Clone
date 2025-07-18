const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");
// delete factor

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const documents = await Model.findByIdAndDelete({ _id: id });
    if (!documents) {
      return next(new AppError(`no product for this id ${id}`, 404));
    }
    res.status(200).json({ data: documents });
  });

// update factory

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!document) {
      return next(new AppError(`no product for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

// create factory

exports.createFctory = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

// get sigle item factory

exports.singleItemFactory = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id).populate({
      path: "category",
      select: "name -_id",
    });
    if (!document) {
      return next(new AppError(`no product for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

// get all factory
exports.getAllFactory = (Model,modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }

    const documentsCount = await Model.countDocuments();

    // built query
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fields()
      .paginate(documentsCount)
      .search(modelName);

    const { mongooseQuery, paginationResult } = apiFeatures;
    // excute query
    const document = await mongooseQuery;

    res.json({ results: document.length, paginationResult, data: document });
  });
