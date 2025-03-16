const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://pesams015:pesams15@cluster0.ezhomhu.mongodb.net/Bagwithtoyo?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PersonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pedning', 'confirmed'], default: 'pending' }
});

const Person = mongoose.model('Person', PersonSchema);

app.post('/persons', async (req, res) => {
    try {
        const { name, location, amount, status } = req.body;
        const person = new Person({ name, location, amount, status });
        await person.save();
        res.status(201).json(person);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/persons', async (req, res) => {
    try {
        const persons = await Person.find();
        res.json(persons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/persons/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const person = await Person.findByIdAndUpdate(id, { status }, { new: true });
        if (!person) return res.status(404).json({ error: 'Person not found' });
        res.json(person);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
