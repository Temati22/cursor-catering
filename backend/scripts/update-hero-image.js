'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

// Helper function to check if file exists before upload
async function checkFileExistsBeforeUpload(filenames) {
  for (const filename of filenames) {
    const filePath = path.join(__dirname, '../data/uploads', filename);
    if (await fs.pathExists(filePath)) {
      console.log(`✓ Found file: ${filename}`);
      return filename;
    }
  }
  console.log(`✗ File not found: ${filenames.join(', ')}`);
  return null;
}

// Helper function to upload file to Strapi
async function uploadFile(filename) {
  const filePath = path.join(__dirname, '../data/uploads', filename);
  
  if (!(await fs.pathExists(filePath))) {
    console.log(`✗ File not found: ${filePath}`);
    return null;
  }

  const fileBuffer = await fs.readFile(filePath);
  const mimeType = mime.lookup(filePath);
  
  const FormData = require('form-data');
  const form = new FormData();
  form.append('files', fileBuffer, {
    filename: filename,
    contentType: mimeType,
  });

  try {
    const response = await fetch('http://localhost:1337/api/upload', {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✓ Uploaded file: ${filename}`);
    return result[0]; // Strapi returns an array
  } catch (error) {
    console.error(`✗ Upload failed for ${filename}:`, error.message);
    return null;
  }
}

// Helper function to update global entry
async function updateGlobal(heroImageId) {
  try {
    const response = await fetch('http://localhost:1337/api/global', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          heroImage: heroImageId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Update failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✓ Updated global heroImage');
    return result;
  } catch (error) {
    console.error('✗ Update failed:', error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️ Updating hero image...');
  
  // Check if beautiful-picture.jpg exists
  const filename = await checkFileExistsBeforeUpload(['beautiful-picture.jpg']);
  if (!filename) {
    console.log('✗ beautiful-picture.jpg not found');
    return;
  }

  // Upload the file
  const uploadedFile = await uploadFile(filename);
  if (!uploadedFile) {
    console.log('✗ Failed to upload file');
    return;
  }

  // Update global entry
  await updateGlobal(uploadedFile.id);
  
  console.log('✅ Hero image updated successfully!');
}

main().catch(console.error);
