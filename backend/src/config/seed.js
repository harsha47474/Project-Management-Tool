import mongoose from "mongoose";


import User from "../models/user.model.js";
import Project from "../models/projects.model.js";
import Task from "../models/task.model.js";

import dotenv from "dotenv";


dotenv.config({ path: "../../.env" });


const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");

        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();

        console.log("Old data cleared");

        // 👤 USERS
        const users = await User.create([
            {
                name: "Harsha",
                email: "harsha1127achu@gmail.com",
                password: "12345678",
                phone: "+919933270389",
                verificationMethod: "email",
                isVerified: true,
            },
            {
                name: "Alice",
                email: "alice@example.com",
                password: "password123",
                phone: "+919876543210",
                verificationMethod: "email",
                isVerified: true,
            },
            {
                name: "Bob",
                email: "bob@example.com",
                password: "password123",
                phone: "+919876543211",
                verificationMethod: "email",
                isVerified: true,
            },
            {
                name: "Charlie",
                email: "charlie@example.com",
                password: "password123",
                phone: "+919876543212",
                verificationMethod: "email",
                isVerified: true,
            },
            {
                name: "David",
                email: "david@example.com",
                password: "password123",
                phone: "+919876543213",
                verificationMethod: "email",
                isVerified: true,
            },
            {
                name: "Eve",
                email: "eve@example.com",
                password: "password123",
                phone: "+919876543214",
                verificationMethod: "email",
                isVerified: true,
            },
        ]);

        const [alice, bob, charlie, david, eve] = users;

        console.log("Users created");

        // 📁 PROJECT 1
        const project1 = await Project.create({
            name: "Project Alpha",
            description: "Full stack web app",
            createdBy: alice._id,
            members: [
                { user: bob._id },
                { user: charlie._id },
            ],
        });

        // 📁 PROJECT 2
        const project2 = await Project.create({
            name: "Project Beta",
            description: "Mobile app development",
            createdBy: bob._id,
            members: [
                { user: alice._id },
                { user: david._id },
            ],
        });

        // 📁 PROJECT 3
        const project3 = await Project.create({
            name: "Project Gamma",
            description: "AI/ML project",
            createdBy: charlie._id,
            members: [
                { user: alice._id },
                { user: eve._id },
            ],
        });

        console.log("Projects created");

        // 🧠 TASKS FOR PROJECT 1
        await Task.create([
            {
                title: "Build login page",
                description: "Frontend login UI",
                project: project1._id,
                createdBy: alice._id,
                assignees: [bob._id],
                status: "todo",
                priority: "high",
            },
            {
                title: "API integration",
                description: "Connect frontend with backend",
                project: project1._id,
                createdBy: alice._id,
                assignees: [charlie._id],
                status: "in_progress",
                priority: "medium",
            },
            {
                title: "Deploy app",
                description: "Deploy to production",
                project: project1._id,
                createdBy: bob._id,
                assignees: [bob._id, charlie._id],
                status: "done",
                priority: "low",
            },
        ]);

        // 🧠 TASKS FOR PROJECT 2
        await Task.create([
            {
                title: "Design UI",
                description: "Mobile UI design",
                project: project2._id,
                createdBy: bob._id,
                assignees: [alice._id],
                status: "todo",
                priority: "high",
            },
            {
                title: "Setup Firebase",
                description: "Auth + DB",
                project: project2._id,
                createdBy: bob._id,
                assignees: [david._id],
                status: "in_progress",
                priority: "medium",
            },
        ]);

        // 🧠 TASKS FOR PROJECT 3
        await Task.create([
            {
                title: "Collect dataset",
                description: "Find training data",
                project: project3._id,
                createdBy: charlie._id,
                assignees: [eve._id],
                status: "todo",
                priority: "high",
            },
            {
                title: "Train model",
                description: "Initial ML model training",
                project: project3._id,
                createdBy: charlie._id,
                assignees: [charlie._id],
                status: "in_progress",
                priority: "medium",
            },
            {
                title: "Evaluate model",
                description: "Accuracy testing",
                project: project3._id,
                createdBy: eve._id,
                assignees: [alice._id],
                status: "done",
                priority: "low",
            },
        ]);

        console.log("Tasks created");

        console.log("\n🔥 Seed completed with multiple projects & tasks!");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();