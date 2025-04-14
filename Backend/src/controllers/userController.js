const User = require('../models/User');

// ✅ Get all recruiters (role: recruiter)
exports.getRecruiters = async (req, res) => {
    try {
        const recruiters = await User.findAll({
            where: { role: 'recruiter' } // Correct Sequelize syntax
        });
        res.status(200).json(recruiters);
    } catch (error) {
        console.error('Error fetching recruiters:', error);
        res.status(500).json({ message: 'Failed to fetch recruiters' });
    }
};
