-- Clear existing data (optional - remove this line if you want to keep existing data)
-- DELETE FROM beats;

-- Insert sample beats data
INSERT INTO beats (
  title, producer, cover_image, price, bpm, key, genre, tags, status, 
  beatstars_link, sales, description, duration
) VALUES 
(
  'Midnight Dreams',
  'Cat Matilda Beat',
  '/placeholder.svg?height=400&width=400&text=Midnight+Dreams',
  29.99,
  140,
  'C Minor',
  'Trap',
  ARRAY['Dark', 'Emotional', 'Trap'],
  'Active',
  'https://beatstars.com/catmatildabeat/midnight-dreams',
  24,
  'A haunting trap beat with atmospheric melodies and hard-hitting 808s.',
  '2:45'
),
(
  'Summer Vibes',
  'Cat Matilda Beat',
  '/placeholder.svg?height=400&width=400&text=Summer+Vibes',
  24.99,
  95,
  'G Major',
  'R&B',
  ARRAY['Chill', 'Summer', 'R&B'],
  'Active',
  'https://beatstars.com/catmatildabeat/summer-vibes',
  18,
  'Smooth R&B vibes perfect for summer tracks.',
  '3:10'
),
(
  'Urban Legend',
  'Cat Matilda Beat',
  '/placeholder.svg?height=400&width=400&text=Urban+Legend',
  34.99,
  160,
  'F Minor',
  'Hip Hop',
  ARRAY['Hard', 'Urban', 'Hip Hop'],
  'Active',
  'https://beatstars.com/catmatildabeat/urban-legend',
  12,
  'Hard-hitting hip hop beat with urban influences.',
  '2:50'
),
(
  'Neon Lights',
  'Cat Matilda Beat',
  '/placeholder.svg?height=400&width=400&text=Neon+Lights',
  27.99,
  128,
  'A Minor',
  'Pop',
  ARRAY['Upbeat', 'Electronic', 'Pop'],
  'Active',
  'https://beatstars.com/catmatildabeat/neon-lights',
  8,
  'Upbeat pop beat with electronic elements.',
  '3:00'
),
(
  'Cosmic Journey',
  'Cat Matilda Beat',
  '/placeholder.svg?height=400&width=400&text=Cosmic+Journey',
  39.99,
  85,
  'E Minor',
  'Ambient',
  ARRAY['Spacey', 'Chill', 'Ambient'],
  'Active',
  'https://beatstars.com/catmatildabeat/cosmic-journey',
  5,
  'Ambient journey through space and time.',
  '4:00'
),
(
  'Street Dreams',
  'Cat Matilda Beat',
  '/placeholder.svg?height=400&width=400&text=Street+Dreams',
  32.99,
  90,
  'D Minor',
  'Boom Bap',
  ARRAY['Old School', 'Hip Hop', 'Boom Bap'],
  'Active',
  'https://beatstars.com/catmatildabeat/street-dreams',
  15,
  'Classic boom bap with old school vibes.',
  '3:20'
),
(
  'Digital Dreams',
  'Cat Matilda Beat',
  '/placeholder.svg?height=400&width=400&text=Digital+Dreams',
  31.99,
  120,
  'F# Minor',
  'Electronic',
  ARRAY['Futuristic', 'Electronic', 'Synth'],
  'Active',
  'https://beatstars.com/catmatildabeat/digital-dreams',
  7,
  'Futuristic electronic beat with digital soundscapes.',
  '3:15'
),
(
  'Sunset Boulevard',
  'Cat Matilda Beat',
  '/placeholder.svg?height=400&width=400&text=Sunset+Boulevard',
  26.99,
  88,
  'A Major',
  'Jazz',
  ARRAY['Smooth', 'Jazz', 'Relaxing'],
  'Active',
  'https://beatstars.com/catmatildabeat/sunset-boulevard',
  11,
  'Smooth jazz-influenced beat perfect for laid-back vibes.',
  '3:45'
);

-- Verify the data was inserted
SELECT COUNT(*) as total_beats FROM beats;
SELECT status, COUNT(*) as count FROM beats GROUP BY status;
