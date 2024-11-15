const mongoose = require("mongoose");
const userSchema = require("../schemas").user;
const counterSchema = require("../schemas").counter;
const counter = mongoose.model("counter", counterSchema);

userSchema.pre('save', async function (next) {
    let app = this;
    if (app.patientDisplayId) return next();

    // patientDisplayId autoincrement
    let patientCounter = await counter.findOne({ counterId: 'patientDisplayId' });
    if (!patientCounter) {
        await counter.create({ counterId: 'patientDisplayId' });
        app.patientDisplayId = `PAT1`;
    } else {
        patientCounter.seq++;  
        patientCounter.save();
        app.patientDisplayId = `PAT${patientCounter.seq}`;
    }
})

userSchema.pre('insertMany', async function (next, docs) {
    if (Array.isArray(docs) && docs.length) {
        let patientCounter = await counter.findOne({ counterId: 'patientDisplayId' });
        const updatedUsers = docs.map(async (user) => {
            return await new Promise(async (resolve, reject) => {
                try {
                    if (!user.patientDisplayId) {
                        if (!patientCounter) {
                            await counter.create({ counterId: 'patientDisplayId' });
                            user.patientDisplayId = `PAT1`;
                        } else {
                            patientCounter.seq++;
                            user.patientDisplayId = `PAT${patientCounter.seq}`;
                        }
                    }
                    resolve(user)
                } catch (err) {
                    reject(err)
                }
            })
        })
        docs = await Promise.all(updatedUsers)
        patientCounter.save();
        next()
    } else {
        return next(new Error("User list should not be empty")) // lookup early return pattern
    }
})

module.exports = mongoose.model("user", userSchema);