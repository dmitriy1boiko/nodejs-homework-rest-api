
const contacts = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");



const getContacts = async (req, res) => {
  const result = await contacts.listContacts();
  res.json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await contacts.getContactById(id);
  if (!result) {
    return res.status(404).json({
      message: "Not found",
    });
  }
  res.json(result);
};

const addNewContact = async (req, res) => {
 
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contacts.removeContact(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateContactById = async (req, res) => {
 
  const { id } = req.params;
  const result = await contacts.updateContact(id, req.body);

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  getContacts: ctrlWrapper(getContacts),
  getContactById: ctrlWrapper(getContactById),
  addNewContact: ctrlWrapper(addNewContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContactById: ctrlWrapper(updateContactById),
};
