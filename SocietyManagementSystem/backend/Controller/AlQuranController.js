//Quran class
import QuranClass from "../Model/AlQuranClass.js";
import User from "../Model/userModel.js";
export const addQuranClass = async (req, res) => {
    try {
        
        const { user, student_name, teacherName, startDate, endDate, schedule, gender } = req.body;
        const userInfo = await User.findById(user);
        if (!userInfo) {
            return res.status(404).json({ error: "User not found." });
        }

        if (userInfo.usertype === 'resident' && !student_name) {
            return res.status(400).json({ error: "Student name is required for resident users." });
        }
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ error: "Start date must be earlier than end date." });
        }

        const newClass = await QuranClass.create({
            user,
            student_name: userInfo.usertype === 'resident' ? student_name : undefined, // Only assign for residents
            teacherName,
            startDate,
            endDate,
            schedule,
            gender,
        });

        res.status(201).json({
            message: "Quran class added successfully.",
            data: newClass,
        });
    } catch (error) {
        console.error("Error adding Quran class:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const updateQuranClass = async (req, res) => {
    const { classId } = req.params; 
    const { teacherName, startDate, endDate, schedule, gender } = req.body; 

    try {
        const quranClass = await QuranClass.findById(classId);

        if (!quranClass) {
            return res.status(404).json({ error: "Quran class not found." });
        }

        // Update fields only if they are provided in the request body
        if (teacherName) quranClass.teacherName = teacherName;
        if (startDate) quranClass.startDate = startDate;
        if (endDate) quranClass.endDate = endDate;
        if (schedule) quranClass.schedule = schedule;
        if (gender) quranClass.gender = gender;


        await quranClass.save();

        return res.status(200).json({
            message: "Quran class updated successfully.",
            data: quranClass,
        });
    } catch (error) {
        console.error("Error updating Quran class:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
export const deleteQuranClass = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedClass = await QuranClass.findByIdAndDelete(id);

        if (!deletedClass) {
            return res.status(404).json({ error: "Quran class not found." });
        }

        res.status(200).json({
            message: "Quran class deleted successfully.",
            data: deletedClass,
        });
    } catch (error) {
        console.error("Error deleting Quran class:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};