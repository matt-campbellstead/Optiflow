const multer = require('multer');
const crypto = require('crypto');
const File = require('../models/mongoose/fileModel');
const FileType = require('file-type');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, '..', 'temp');
    logger.info(tempDir);
    fs.ensureDirSync(tempDir);
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(file.originalname);
    cb(null, `${randomName}${extension}`);
  },
});

const filter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new AppError('Invalid file type', 400), false);
};

const upload = multer({
  storage: storage,
  fileFilter: filter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

exports.uploadFile = upload.single('pdf');

// Enhanced file type validation
exports.validateFileType = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400));
  logger.info(req.file);
  try {
    // Read file buffer
    const buffer = req.file.buffer || (await fs.readFile(req.file.path));

    // Check file type using magic numbers
    const fileType = await FileType.fromBuffer(buffer);

    if (!fileType)
      return next(new AppError('Unable to determine file type', 400));

    // Define allowed MIME types and extensions
    const allowedTypes = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    };

    const allowedExtensions = allowedTypes[fileType.mime];

    if (!allowedExtensions)
      return next(new AppError('File type not allowed', 400));

    // Check if file extension matches MIME type
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension))
      return next(new AppError('File extension does not match file type', 400));

    // Store validated file type
    req.file.validatedType = fileType.mime;
    next();
  } catch (error) {
    throw error;
  }
});

// Secure file storage configuration
const secureStorage = {
  // Generate secure file path
  generateSecurePath: (filename, userId) => {
    const timestamp = Date.now();
    const hash = crypto
      .createHash('sha256')
      .update(`${userId}${timestamp}${filename}`)
      .digest('hex');

    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    return path.join('uploads', String(year), month, hash);
  },

  // Create secure directory structure
  createSecureDirectory: async (filePath) => {
    const dir = path.dirname(filePath);
    await fs.ensureDir(dir);
    return dir;
  },

  // Move file to secure location
  moveToSecureLocation: async (tempPath, securePath) => {
    await fs.move(tempPath, securePath);
    return securePath;
  },

  // Clean up temporary files
  cleanupTempFile: async (tempPath) => {
    try {
      await fs.remove(tempPath);
    } catch (error) {
      logger.error('Failed to cleanup temp file:', error);
    }
  },
};

// Image content validation
exports.validateImageContent = asyncHandler(async (req, res, next) => {
  if (!req.file || !req.file.validatedType.startsWith('image/')) return next();

  try {
    const imagePath = req.file.path;

    // Validate image using Sharp
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // Check image dimensions
    if (metadata.width > 5000 || metadata.height > 5000)
      return next(new AppError('Image dimensions too large', 400));

    // Check file size after processing
    const stats = await fs.stat(imagePath);
    if (stats.size > 5 * 1024 * 1024)
      // 5MB
      return next(new AppError('File size too large', 400));

    // Store image metadata
    req.file.imageMetadata = metadata;
    next();
  } catch (error) {
    throw error;
  }
});

// PDF content validation
exports.validatePDFContent = asyncHandler(async (req, res, next) => {
  if (!req.file || req.file.validatedType !== 'application/pdf') return next();

  try {
    const pdfPath = req.file.path;
    const buffer = await fs.readFile(pdfPath);

    // Check PDF header
    const header = buffer.toString('ascii', 0, 4);
    if (header !== '%PDF') return next(new AppError('Invalid PDF file', 400));

    // Check for embedded JavaScript (optional)
    const content = buffer.toString('ascii');
    if (content.includes('/JS') || content.includes('/JavaScript'))
      return next(new AppError('PDF contains embedded JavaScript'), 400);

    next();
  } catch (error) {
    throw error;
    //return res.status(400).json({ error: 'PDF validation failed' });
  }
});

// Image processing and sanitization
exports.processImage = asyncHandler(async (req, res, next) => {
  if (!req.file || !req.file.validatedType.startsWith('image/')) return next();

  try {
    const imagePath = req.file.path;
    const processedPath = imagePath.replace(/\.[^/.]+$/, '_processed.jpg');

    // Process image with Sharp
    await sharp(imagePath)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toFile(processedPath);

    // Remove original file
    await fs.remove(imagePath);

    // Update file path
    req.file.path = processedPath;
    req.file.filename = path.basename(processedPath);

    next();
  } catch (error) {
    throw error;
    //return res.status(500).json({ error: 'Image processing failed' });
  }
});

// File sanitization
exports.sanitizeFile = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filePath = req.file.path;
    const buffer = await fs.readFile(filePath);

    // Remove potentially dangerous content
    let sanitizedBuffer = buffer;

    // For images, ensure they're properly formatted
    if (req.file.validatedType.startsWith('image/')) {
      const image = sharp(buffer);
      sanitizedBuffer = await image.jpeg({ quality: 80 }).toBuffer();
    }

    // For text files, remove script tags
    if (req.file.validatedType === 'text/plain') {
      const content = buffer.toString('utf8');
      const sanitizedContent = content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
      sanitizedBuffer = Buffer.from(sanitizedContent, 'utf8');
    }

    // Write sanitized content back
    await fs.writeFile(filePath, sanitizedBuffer);

    next();
  } catch (error) {
    throw error;
    //return res.status(500).json({ error: 'File sanitization failed' });
  }
});

/**
 *
 * TODO: Microsoft Graph API ??
 *
 **/

exports.testFunction = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError('Upload file is missing', 400));

    // Generate secure path
    const userId = req.user?.id || 'anonymous';

    const securePath = secureStorage.generateSecurePath(
      req.file.filename,
      userId,
    );
    const fullSecurePath = path.join(__dirname, '..', securePath);

    // Create secure directory
    await secureStorage.createSecureDirectory(fullSecurePath);

    // Move file to secure location
    const finalPath = await secureStorage.moveToSecureLocation(
      req.file.path,
      fullSecurePath,
    );

    // Store file information in database (implement your own logic)
    const fileInfo = {
      id: crypto.randomBytes(16).toString('hex'),
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: securePath,
      size: req.file.size,
      mimeType: req.file.validatedType,
      uploadedBy: userId,
      uploadedAt: new Date(),
    };

    const document = await File.create(fileInfo);
    logger.info('file info for the DB: ', document);

    res.status(200).json({
      status: 'success',
      messsage: 'file uploaded and written to DB successfully',
      data: {
        file: document,
      },
    });
  } catch (error) {
    // Cleanup on error
    if (req.file) await secureStorage.cleanupTempFile(req.file.path);

    throw error;
    //res.status(500).json({ error: 'File upload failed' });
  }
});

exports.getUploadRecords = asyncHandler(async (req, res, next) => {
  const documents = await File.find();
  logger.info(documents);
  if (!documents)
    return next(new AppError('There are no records in the DB!', 404));

  res.status(200).json({
    status: 'success',
    message: 'upload records successfully fetched',
    results: documents.length,
    data: {
      documents,
    },
  });
});
