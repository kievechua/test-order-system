/**
 * GET /
 * Home page.
 */
exports.index = async (req, res) => {
  res.json([]);
};

exports.create = async (req, res) => {
  res.json({
    status: Math.round(Math.random()) ? 'confirmed' : 'declined'
  });
};
