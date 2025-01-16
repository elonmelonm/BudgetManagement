const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.scope('all').findAll({
            attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt'] // Filtrage des champs si nécessaire
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, {
            attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
        });

        if (!user) {
            console.error('User not found.');
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            console.error('User not found.');
            return res.status(404).json({ error: 'User not found.' });
        }

        // Mise à jour des champs autorisés
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
        console.error('User ' + email + ' updated successfully');
        } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user.' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si l'utilisateur existe et n'est pas déjà supprimé
        const user = await User.findOne({
            where: { id, is_deleted: false }, // Inclure la vérification de "is_deleted"
        });

        if (!user) {
            console.log('User not found or already deleted.')
            return res.status(404).json({ error: 'User not found or already deleted.' });
        }

        // Mettre à jour l'état "is_deleted"
        user.is_deleted = true;
        await user.save();

        res.status(200).json({ message: 'User soft deleted successfully.' });
        console.log('User soft deleted successfully.')
        } catch (error) {
        console.error('Error soft deleting user:', error);
        res.status(500).json({ error: 'Failed to soft delete user.' });
    }
};
