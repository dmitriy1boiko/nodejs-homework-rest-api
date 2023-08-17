const {Contact} = require("../models/contact");
 const { HttpError, ctrlWrapper } = require("../helpers");

const getContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const result = await Contact.find(
      {owner}, '-createdAt -updatedAt', {skip, limit}
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  console.log(id);
  if (!result) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  res.json(result);
};

const addNewContact = async (req, res) => {
  const {_id: owner} = req.user;
  console.log(req.params)
  const result = await Contact.create({...req.body, owner}).populate('owner', 'name email');
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateContactById = async (req, res) => {
  const { id } = req.params;
  console.log(id );
  const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  console.log(id );
  const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  getContacts: ctrlWrapper(getContacts),
  getContactById: ctrlWrapper(getContactById),
  addNewContact: ctrlWrapper(addNewContact),
  updateFavorite: ctrlWrapper(updateFavorite),
  deleteContact: ctrlWrapper(deleteContact),
  updateContactById: ctrlWrapper(updateContactById),
};
