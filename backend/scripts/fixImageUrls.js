const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Project = require('../models/Project');
const Team = require('../models/Team');

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixImageUrls = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');
    console.log('==========================================');

    // Fix Projects
    console.log('🔍 CHECKING PROJECTS...');
    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects\n`);

    let fixedProjects = 0;
    let brokenProjects = 0;

    for (const project of projects) {
      console.log(`📁 Project: ${project.title}`);
      let changed = false;

      // Check mainImage
      if (project.mainImage) {
        if (!project.mainImage.includes('cloudinary.com')) {
          console.log(`  ❌ mainImage is NOT Cloudinary URL: ${project.mainImage}`);
          console.log(`  ✅ Setting mainImage to placeholder`);
          project.mainImage = null;
          changed = true;
          brokenProjects++;
        } else {
          console.log(`  ✅ mainImage is valid Cloudinary URL`);
        }
      } else {
        console.log(`  ⚠️ mainImage is missing`);
        brokenProjects++;
      }

      // Check image field (backward compatibility)
      if (project.image && !project.image.includes('cloudinary.com')) {
        console.log(`  ❌ image field is invalid, clearing...`);
        project.image = null;
        changed = true;
      }

      // Check images array
      if (project.images && project.images.length > 0) {
        const validImages = project.images.filter(img => img.includes('cloudinary.com'));
        if (validImages.length !== project.images.length) {
          console.log(`  ❌ Found ${project.images.length - validImages.length} invalid additional images`);
          project.images = validImages;
          changed = true;
        }
        console.log(`  ✅ ${validImages.length} valid additional images`);
      }

      // Check cloudinaryIds
      if (!project.cloudinaryIds) {
        console.log(`  ⚠️ No cloudinaryIds field, adding empty object`);
        project.cloudinaryIds = { main: null, additional: [] };
        changed = true;
      }

      if (changed) {
        await project.save();
        fixedProjects++;
        console.log(`  ✅ Project updated successfully\n`);
      } else {
        console.log(`  ✓ No changes needed\n`);
      }
    }

    console.log('==========================================');
    console.log('📊 PROJECT SUMMARY:');
    console.log(`   Total Projects: ${projects.length}`);
    console.log(`   Fixed Projects: ${fixedProjects}`);
    console.log(`   Broken Projects: ${brokenProjects}`);
    console.log('==========================================\n');

    // Fix Team Members
    console.log('🔍 CHECKING TEAM MEMBERS...');
    const teamMembers = await Team.find({});
    console.log(`Found ${teamMembers.length} team members\n`);

    let fixedTeam = 0;
    let brokenTeam = 0;

    for (const member of teamMembers) {
      console.log(`👤 Team Member: ${member.name}`);
      let changed = false;

      if (member.image) {
        if (!member.image.includes('cloudinary.com')) {
          console.log(`  ❌ image is NOT Cloudinary URL: ${member.image}`);
          console.log(`  ✅ Setting image to placeholder`);
          member.image = null;
          changed = true;
          brokenTeam++;
        } else {
          console.log(`  ✅ image is valid Cloudinary URL`);
        }
      } else {
        console.log(`  ⚠️ image is missing`);
        brokenTeam++;
      }

      if (!member.cloudinaryId) {
        console.log(`  ⚠️ No cloudinaryId field`);
        changed = true;
      }

      if (changed) {
        await member.save();
        fixedTeam++;
        console.log(`  ✅ Team member updated successfully\n`);
      } else {
        console.log(`  ✓ No changes needed\n`);
      }
    }

    console.log('==========================================');
    console.log('📊 TEAM SUMMARY:');
    console.log(`   Total Team Members: ${teamMembers.length}`);
    console.log(`   Fixed Team Members: ${fixedTeam}`);
    console.log(`   Broken Team Members: ${brokenTeam}`);
    console.log('==========================================\n');

    console.log('🎉 Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

fixImageUrls();