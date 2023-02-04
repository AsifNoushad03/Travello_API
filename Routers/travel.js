const router = require("express").Router();
const Travel = require('../Models/Travel')
const { verifyToken } = require('./verfyToken')


// Get travel loged user
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const travel = await Travel.find({ userId: req.params.userId })
        res.status(200).json(travel)
    } catch (error) {
        res.status(400).json(error)
    }
})


// Travel Create
router.post('/', verifyToken, async (req, res) => {
    const { destination, startDate, endDate, budget, description, userId } = req.body
    if (!destination || !startDate || !endDate || !budget || !description || !userId) {
        res.status(400).json('Fill all Fields');
    }

    const travelDetails = new Travel({
        destination: req.body.destination,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        budget: req.body.budget,
        description: req.body.description,
        userId: req.body.userId
    })

    try {
        const saveTravelDetails = await travelDetails.save()
        res.status(200).json(saveTravelDetails)

    } catch {
        res.status(500).json(err)
    }

})

// Travel Update
router.put('/:id', verifyToken, async (req, res) => {
    const { destination, startDate, endDate, budget, description, userId } = req.body
    if (!destination || !startDate || !endDate || !budget || !description || !userId) {
        res.status(400).json('Fill all Fields');
    }

    try {
        const updateTravel = await Travel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updateTravel)
    } catch (error) {
        res.status(400).json(error)
    }
})

//Travel Delete
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Travel.findByIdAndDelete(req.params.id)
        res.status(200).json('Product Deleted Succsefully');
    } catch (error) {
        res.status(400).json(error)
    }
})


module.exports = router