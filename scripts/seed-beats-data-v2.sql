-- Insert sample beats data with different categories
INSERT INTO beats (title, producer, genre, bpm, key, duration, cover_image, beatstars_link, sales, status, category) VALUES
-- Trending beats
('Midnight Vibes', 'ProducerX', 'Trap', 140, 'C minor', '3:24', '/placeholder.svg?height=300&width=300&text=Midnight+Vibes', 'https://beatstars.com/beat/midnight-vibes', 45, 'active', 'trending'),
('City Lights', 'BeatMaker', 'Hip Hop', 85, 'G major', '2:58', '/placeholder.svg?height=300&width=300&text=City+Lights', 'https://beatstars.com/beat/city-lights', 32, 'active', 'trending'),
('Neon Dreams', 'SoundWave', 'Trap', 150, 'A minor', '3:12', '/placeholder.svg?height=300&width=300&text=Neon+Dreams', 'https://beatstars.com/beat/neon-dreams', 28, 'active', 'trending'),
('Urban Flow', 'RhythmKing', 'Hip Hop', 90, 'D minor', '3:45', '/placeholder.svg?height=300&width=300&text=Urban+Flow', 'https://beatstars.com/beat/urban-flow', 67, 'active', 'trending'),
('Dark Trap Vibes', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 140, 'C Minor', 'Trap', '3:15', 'https://beatstars.com/catmatildabeat', 45, 'active', 'trending'),
('Melodic Hip Hop', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 95, 'G Major', 'Hip Hop', '3:45', 'https://beatstars.com/catmatildabeat', 38, 'active', 'trending'),
('Drill Energy', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 150, 'F# Minor', 'Drill', '2:58', 'https://beatstars.com/catmatildabeat', 52, 'active', 'trending'),

-- Featured beats
('Smooth Operator', 'JazzMaster', 'R&B', 75, 'F major', '4:02', '/placeholder.svg?height=300&width=300&text=Smooth+Operator', 'https://beatstars.com/beat/smooth-operator', 89, 'active', 'featured'),
('Electric Soul', 'VibeMaker', 'Pop', 120, 'E major', '3:18', '/placeholder.svg?height=300&width=300&text=Electric+Soul', 'https://beatstars.com/beat/electric-soul', 156, 'active', 'featured'),
('Golden Hour', 'MelodyMaster', 'Lo-Fi', 65, 'C major', '2:45', '/placeholder.svg?height=300&width=300&text=Golden+Hour', 'https://beatstars.com/beat/golden-hour', 234, 'active', 'featured'),
('Skyline', 'BeatCrafters', 'Trap', 145, 'B minor', '3:33', '/placeholder.svg?height=300&width=300&text=Skyline', 'https://beatstars.com/beat/skyline', 78, 'active', 'featured'),
('R&B Sunset', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 85, 'D Major', 'R&B', '4:12', 'https://beatstars.com/catmatildabeat', 67, 'active', 'featured'),
('Pop Anthem', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 128, 'C Major', 'Pop', '3:28', 'https://beatstars.com/catmatildabeat', 89, 'active', 'featured'),
('Afrobeat Fusion', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 110, 'A Minor', 'Afrobeat', '3:52', 'https://beatstars.com/catmatildabeat', 34, 'active', 'featured'),

-- New releases
('Fresh Start', 'NewWave', 'Hip Hop', 95, 'G minor', '3:07', '/placeholder.svg?height=300&width=300&text=Fresh+Start', 'https://beatstars.com/beat/fresh-start', 12, 'active', 'new_releases'),
('Digital Dreams', 'TechBeats', 'Electronic', 128, 'A major', '3:56', '/placeholder.svg?height=300&width=300&text=Digital+Dreams', 'https://beatstars.com/beat/digital-dreams', 8, 'active', 'new_releases'),
('Sunset Boulevard', 'CoastBeats', 'R&B', 80, 'D major', '4:15', '/placeholder.svg?height=300&width=300&text=Sunset+Boulevard', 'https://beatstars.com/beat/sunset-boulevard', 15, 'active', 'new_releases'),
('Thunder Storm', 'StormBeats', 'Drill', 160, 'F# minor', '2:48', '/placeholder.svg?height=300&width=300&text=Thunder+Storm', 'https://beatstars.com/beat/thunder-storm', 6, 'active', 'new_releases'),
('Future Bass Drop', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 150, 'E Minor', 'Electronic', '3:33', 'https://beatstars.com/catmatildabeat', 12, 'active', 'new_releases'),
('Lo-Fi Dreams', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 70, 'F Major', 'Lo-Fi', '4:05', 'https://beatstars.com/catmatildabeat', 28, 'active', 'new_releases'),
('UK Drill Banger', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 145, 'B Minor', 'UK Drill', '2:47', 'https://beatstars.com/catmatildabeat', 19, 'active', 'new_releases'),

-- Latest tracks
('Morning Coffee', 'ChillBeats', 'Lo-Fi', 70, 'C major', '3:21', '/placeholder.svg?height=300&width=300&text=Morning+Coffee', 'https://beatstars.com/beat/morning-coffee', 23, 'active', 'latest'),
('Street Symphony', 'UrbanSounds', 'Hip Hop', 88, 'E minor', '3:42', '/placeholder.svg?height=300&width=300&text=Street+Symphony', 'https://beatstars.com/beat/street-symphony', 34, 'active', 'latest'),
('Velvet Touch', 'SoulMaker', 'R&B', 72, 'A♭ major', '4:08', '/placeholder.svg?height=300&width=300&text=Velvet+Touch', 'https://beatstars.com/beat/velvet-touch', 19, 'active', 'latest'),
('Neon Nights', 'SynthWave', 'Pop', 115, 'B major', '3:29', '/placeholder.svg?height=300&width=300&text=Neon+Nights', 'https://beatstars.com/beat/neon-nights', 41, 'active', 'latest'),
('Bass Drop', 'HeavyBeats', 'Trap', 155, 'G# minor', '2:54', '/placeholder.svg?height=300&width=300&text=Bass+Drop', 'https://beatstars.com/beat/bass-drop', 27, 'active', 'latest'),
('Midnight Express', 'TrainBeats', 'Hip Hop', 92, 'F minor', '3:38', '/placeholder.svg?height=300&width=300&text=Midnight+Express', 'https://beatstars.com/beat/midnight-express', 52, 'active', 'latest'),
('Ambient Trap', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 135, 'A# Minor', 'Trap', '3:21', 'https://beatstars.com/catmatildabeat', 8, 'active', 'latest'),
('Jazz Hip Hop', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 90, 'Bb Major', 'Hip Hop', '3:58', 'https://beatstars.com/catmatildabeat', 15, 'active', 'latest'),
('Synthwave Retro', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 120, 'C# Minor', 'Synthwave', '4:15', 'https://beatstars.com/catmatildabeat', 22, 'active', 'latest'),
('Gospel Trap', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 140, 'G Minor', 'Trap', '3:42', 'https://beatstars.com/catmatildabeat', 31, 'active', 'latest'),
('Boom Bap Classic', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 95, 'D Minor', 'Hip Hop', '3:18', 'https://beatstars.com/catmatildabeat', 26, 'active', 'latest'),
('Reggaeton Fire', 'Cat Matilda Beat', '/placeholder.svg?height=400&width=400', 95, 'E Major', 'Reggaeton', '3:35', 'https://beatstars.com/catmatildabeat', 41, 'active', 'latest');
