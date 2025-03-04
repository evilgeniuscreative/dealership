import express, { Request, Response, Router } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../services/database';
import { CarouselImage, CarouselImageInput } from '../types/carousel';
import { authMiddleware } from '../middleware/auth';

const router: Router = express.Router();

// Get all carousel images with optional type filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const carouselType = req.query.type || 'main';
    
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM carousel_images WHERE carousel_type = ? ORDER BY display_order ASC',
      [carouselType]
    );
    
    res.json(rows as CarouselImage[]);
  } catch (error) {
    console.error('Error fetching carousel images:', error);
    res.status(500).json({ error: 'Failed to fetch carousel images' });
  }
});

// Create a new carousel image
router.post('/', authMiddleware, async (req: Request<{}, {}, CarouselImageInput & { car_id?: number }>, res: Response) => {
  try {
    const carouselImage = req.body;
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO carousel_images (imageUrl, title, subtitle, delay, display_order, carousel_type, car_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [carouselImage.imageUrl, carouselImage.title, carouselImage.subtitle, carouselImage.delay, carouselImage.displayOrder, carouselImage.carousel_type, carouselImage.car_id]
    );

    const newImage = { ...carouselImage, id: result.insertId };
    res.status(201).json(newImage);
  } catch (error) {
    console.error('Error creating carousel image:', error);
    res.status(500).json({ error: 'Failed to create carousel image' });
  }
});

// Update a carousel image
router.put('/:id', authMiddleware, async (req: Request<{ id: string }, {}, CarouselImageInput & { car_id?: number }>, res: Response) => {
  try {
    const carouselImage = req.body;
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE carousel_images SET imageUrl = ?, title = ?, subtitle = ?, delay = ?, display_order = ?, carousel_type = ?, car_id = ? WHERE id = ?',
      [carouselImage.imageUrl, carouselImage.title, carouselImage.subtitle, carouselImage.delay, carouselImage.displayOrder, carouselImage.carousel_type, carouselImage.car_id, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Carousel image not found' });
    }

    const updatedImage = { ...carouselImage, id: parseInt(req.params.id) };
    res.json(updatedImage);
  } catch (error) {
    console.error('Error updating carousel image:', error);
    res.status(500).json({ error: 'Failed to update carousel image' });
  }
});

// Delete a carousel image
router.delete('/:id', authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM carousel_images WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Carousel image not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting carousel image:', error);
    res.status(500).json({ error: 'Failed to delete carousel image' });
  }
});

export default router;
