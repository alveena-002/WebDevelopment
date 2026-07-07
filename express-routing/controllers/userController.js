let users =[
    {
        id: 1,
        name: "Alveena"
    },
    {
        id: 2,
        name: "Tahreem"
    }
];
// GET
const getUsers = (req, res) => {
    res.json(users);
};
// POST
const addUser = (req, res) => {
    const user = req.body;
    users.push(user);
    res.json({
        message: "User Added",
        data: user
    });
};
// PUT
const updateUser = (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) {
        return res.status(404).json({
            message: "User Not Found"
        });
    }
    user.name = req.body.name;
    res.json({
        message: "User Updated",
        data: user
    });
};
// DELETE
const deleteUser = (req, res) => {
    const id = Number(req.params.id);
    users = users.filter(user => user.id !== id);
    res.json({
        message: "User Deleted"
    });
};

module.exports = {
    getUsers,
    addUser,
    updateUser,
    deleteUser
};