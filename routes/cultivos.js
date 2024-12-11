import express from 'express';
import { db } from '../database/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// Obtener todos los cultivos
router.get('/', authenticateToken, async (req, res) => {
  const query = 'SELECT * FROM cultivos';
  
  try {
    const [results] = await db.query(query); // db.query devuelve una promesa
    res.json(results); // Enviar resultados en la respuesta
  } catch (err) {
    console.error('Error al obtener cultivos:', err);
    res.status(500).json({ error: 'Error al obtener cultivos', details: err });
  }
});

// Obtener un cultivo por su ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM cultivos WHERE id = ?';

  try {
    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      // Si no se encuentra el cultivo, devolver un 404
      return res.status(404).json({ error: 'Cultivo no encontrado' });
    }

    // Enviar solo el primer resultado (el cultivo con el ID)
    res.json(results[0]);
  } catch (err) {
    console.error('Error al obtener cultivo:', err);
    res.status(500).json({ error: 'Error al obtener cultivo', details: err });
  }
});

// Crear cultivo
router.post('/', async (req, res) => {
  const { nombre, temp, iluminosidad, humedad_suelo, humedad_aire } = req.body;

  try {
    const query = 'INSERT INTO cultivos (nombre, temp, iluminosidad, humedad_suelo, humedad_aire) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [nombre, temp, iluminosidad, humedad_suelo, humedad_aire]);

    // Enviar respuesta con los datos insertados
    res.json({ id: result.insertId, nombre, temp, iluminosidad, humedad_suelo, humedad_aire });
  } catch (err) {
    // Manejar errores y enviar la respuesta
    console.error('Error al insertar cultivo:', err);
    res.status(500).json({ error: 'Error al insertar cultivo', details: err });
  }
});

// Actualizar cultivo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, temp, iluminosidad, humedad_suelo, humedad_aire } = req.body;
  const query = 'UPDATE cultivos SET nombre = ?, temp = ?, iluminosidad = ?, humedad_suelo = ?, humedad_aire = ? WHERE id = ?';

  const [result] = await db.query(query, [nombre, temp, iluminosidad, humedad_suelo, humedad_aire, id]);

  if (!result) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar el cultivo', details: err });
  }
  
  res.json({ message: result });
});

// Eliminar cultivo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM cultivos WHERE id = ?';

  try {
    // Usamos `await` para esperar que la consulta se complete
    await db.query(query, [id]);
    
    // Enviar respuesta exitosa
    res.json({ message: 'Cultivo eliminado con éxito' });
  } catch (err) {
    // Manejo de errores
    console.error('Error al eliminar cultivo:', err);
    res.status(500).json({ error: 'Error al eliminar cultivo', details: err });
  }
});

export default router;