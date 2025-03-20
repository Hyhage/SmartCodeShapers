import { mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// Define the upload directory
export const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure the upload directory exists
export const ensureUploadDir = async () => {
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
};

// Save a file from FormData to disk
export const saveFile = async (file: File): Promise<string> => {
  await ensureUploadDir();
  
  // Create a unique filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}-${file.name}`;
  const filepath = path.join(uploadDir, filename);
  
  // Convert file to array buffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Write to disk using fs.writeFileSync with type assertion
  const uint8Array = new Uint8Array(arrayBuffer);
  fs.writeFileSync(filepath, uint8Array);
  
  return filepath;
};

// Delete a file
export const deleteFile = async (filepath: string): Promise<void> => {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
