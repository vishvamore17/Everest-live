// Import your models
const User = require("../model/usersSchema.model");
const Deal = require("../model/dealSchema.model");

const Search =  async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Query is required" });

    const regex = new RegExp(query, "i");

    // Search across different collections
    const users = await User.find({ $or: [{ name: regex }, { email: regex }] }).limit(5);
    const deals = await Deal.find({  $or: [{ comapanyName: regex }, { email: regex }] }).limit(5);

    // Create suggestions for where the item appears
    let suggestions = [];
    if (users.length > 0) suggestions.push({ page: "Users", path: "/users" });
    if (deals.length > 0) suggestions.push({ page: "Deals", path: "/deals" });

    res.json({ users, deals, suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  
}
};

module.exports = {Search}