import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const updateContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contactById = contacts.find((el) => el.id === contactId);
  return contactById || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((el) => el.id === contactId);
  if (index === -1) {
    return null;
  }
  const [contactToRemove] = contacts.splice(index, 1);
  await updateContacts(contacts);
  return contactToRemove;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}

async function updateContact(id, name, email, phone) {
  const contacts = await listContacts();
  const index = contacts.findIndex((el) => el.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = {
    id,
    name,
    email,
    phone,
  };
  await updateContacts(contacts);
  return contacts[index];
}

const contactsAPI = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};

export default contactsAPI;
