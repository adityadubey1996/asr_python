const verifyUser = async (req, res) => {
  try {
    const token = req.cookies["x-auth-token"];
  } catch (error) {}
};

module.exports = {
  verifyUser,
};
