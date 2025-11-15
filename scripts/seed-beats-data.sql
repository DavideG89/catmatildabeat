-- Insert sample beats data with standardized genres
INSERT INTO beats (title, producer, genre, bpm, key, duration, cover_image, beatstars_link, sales, status, category) VALUES
-- Trending beats
('Midnight Vibes', 'ProducerX', 'Rap', 140, 'C minor', '3:24', '/placeholder.svg?height=300&width=300&text=Midnight+Vibes', 'https://beatstars.com/beat/midnight-vibes', 45, 'active', 'trending'),
('City Lights', 'BeatMaker', 'HipHop', 85, 'G major', '2:58', '/placeholder.svg?height=300&width=300&text=City+Lights', 'https://beatstars.com/beat/city-lights', 32, 'active', 'trending'),
('Neon Dreams', 'SoundWave', 'Alternative HipHop', 150, 'A minor', '3:12', '/placeholder.svg?height=300&width=300&text=Neon+Dreams', 'https://beatstars.com/beat/neon-dreams', 28, 'active', 'trending'),
('Urban Flow', 'RhythmKing', 'HipHop', 90, 'D minor', '3:45', '/placeholder.svg?height=300&width=300&text=Urban+Flow', 'https://beatstars.com/beat/urban-flow', 67, 'active', 'trending'),
('Midnight Pulse', 'Matilda The Cat', 'Ambient Electronic', 138, 'C minor', '3:15', '/placeholder.svg?height=400&width=400&text=Midnight+Pulse', 'https://beatstars.com/catmatildabeat', 45, 'active', 'trending'),
('Melodic Switch', 'Matilda The Cat', 'Alternative HipHop', 95, 'G major', '3:45', '/placeholder.svg?height=400&width=400&text=Melodic+Switch', 'https://beatstars.com/catmatildabeat', 38, 'active', 'trending'),
('Drill Energy', 'Matilda The Cat', 'Rap', 150, 'F# minor', '2:58', '/placeholder.svg?height=400&width=400&text=Drill+Energy', 'https://beatstars.com/catmatildabeat', 52, 'active', 'trending'),

-- Featured beats
('Smooth Operator', 'JazzMaster', 'Cinematic Emotional', 75, 'F major', '4:02', '/placeholder.svg?height=300&width=300&text=Smooth+Operator', 'https://beatstars.com/beat/smooth-operator', 89, 'active', 'featured'),
('Electric Soul', 'VibeMaker', 'Electronic', 120, 'E major', '3:18', '/placeholder.svg?height=300&width=300&text=Electric+Soul', 'https://beatstars.com/beat/electric-soul', 156, 'active', 'featured'),
('Golden Hour', 'MelodyMaster', 'Lo-Fi', 65, 'C major', '2:45', '/placeholder.svg?height=300&width=300&text=Golden+Hour', 'https://beatstars.com/beat/golden-hour', 234, 'active', 'featured'),
('Skyline', 'BeatCrafters', 'Alternative Rock', 145, 'B minor', '3:33', '/placeholder.svg?height=300&width=300&text=Skyline', 'https://beatstars.com/beat/skyline', 78, 'active', 'featured'),
('Evening Glow', 'Matilda The Cat', 'Ambient', 85, 'D major', '4:12', '/placeholder.svg?height=400&width=400&text=Evening+Glow', 'https://beatstars.com/catmatildabeat', 67, 'active', 'featured'),
('Pop Anthem', 'Matilda The Cat', 'Rock', 128, 'C major', '3:28', '/placeholder.svg?height=400&width=400&text=Pop+Anthem', 'https://beatstars.com/catmatildabeat', 89, 'active', 'featured'),
('Groove Fusion', 'Matilda The Cat', 'Funk', 110, 'A minor', '3:52', '/placeholder.svg?height=400&width=400&text=Groove+Fusion', 'https://beatstars.com/catmatildabeat', 34, 'active', 'featured'),

-- New releases
('Fresh Start', 'NewWave', 'HipHop', 95, 'G minor', '3:07', '/placeholder.svg?height=300&width=300&text=Fresh+Start', 'https://beatstars.com/beat/fresh-start', 12, 'active', 'new_releases'),
('Digital Dreams', 'TechBeats', 'Electronic', 128, 'A major', '3:56', '/placeholder.svg?height=300&width=300&text=Digital+Dreams', 'https://beatstars.com/beat/digital-dreams', 8, 'active', 'new_releases'),
('Sunset Boulevard', 'CoastBeats', 'Trip Hop', 80, 'D major', '4:15', '/placeholder.svg?height=300&width=300&text=Sunset+Boulevard', 'https://beatstars.com/beat/sunset-boulevard', 15, 'active', 'new_releases'),
('Thunder Storm', 'StormBeats', 'Alternative HipHop', 160, 'F# minor', '2:48', '/placeholder.svg?height=300&width=300&text=Thunder+Storm', 'https://beatstars.com/beat/thunder-storm', 6, 'active', 'new_releases'),
('Future Bass Drop', 'Matilda The Cat', 'Electronic', 150, 'E minor', '3:33', '/placeholder.svg?height=400&width=400&text=Future+Bass+Drop', 'https://beatstars.com/catmatildabeat', 12, 'active', 'new_releases'),
('Lo-Fi Dreams', 'Matilda The Cat', 'Lo-Fi', 70, 'F major', '4:05', '/placeholder.svg?height=400&width=400&text=Lo-Fi+Dreams', 'https://beatstars.com/catmatildabeat', 28, 'active', 'new_releases'),
('Retro Runner', 'Matilda The Cat', 'Synthwave', 145, 'B minor', '2:47', '/placeholder.svg?height=400&width=400&text=Retro+Runner', 'https://beatstars.com/catmatildabeat', 19, 'active', 'new_releases'),

-- Latest tracks
('Morning Coffee', 'ChillBeats', 'Lo-Fi', 70, 'C major', '3:21', '/placeholder.svg?height=300&width=300&text=Morning+Coffee', 'https://beatstars.com/beat/morning-coffee', 23, 'active', 'latest'),
('Street Symphony', 'UrbanSounds', 'HipHop', 88, 'E minor', '3:42', '/placeholder.svg?height=300&width=300&text=Street+Symphony', 'https://beatstars.com/beat/street-symphony', 34, 'active', 'latest'),
('Velvet Touch', 'SoulMaker', 'Trip Hop', 72, 'A♭ major', '4:08', '/placeholder.svg?height=300&width=300&text=Velvet+Touch', 'https://beatstars.com/beat/velvet-touch', 19, 'active', 'latest'),
('Neon Nights', 'SynthWave', 'Synthwave', 115, 'B major', '3:29', '/placeholder.svg?height=300&width=300&text=Neon+Nights', 'https://beatstars.com/beat/neon-nights', 41, 'active', 'latest'),
('Bass Drop', 'HeavyBeats', 'FunkRock', 155, 'G# minor', '2:54', '/placeholder.svg?height=300&width=300&text=Bass+Drop', 'https://beatstars.com/beat/bass-drop', 27, 'active', 'latest'),
('Midnight Express', 'TrainBeats', 'HipHop', 92, 'F minor', '3:38', '/placeholder.svg?height=300&width=300&text=Midnight+Express', 'https://beatstars.com/beat/midnight-express', 52, 'active', 'latest'),
('Ambient Trails', 'Matilda The Cat', 'Ambient', 135, 'A# minor', '3:21', '/placeholder.svg?height=400&width=400&text=Ambient+Trails', 'https://beatstars.com/catmatildabeat', 8, 'active', 'latest'),
('Golden Era', 'Matilda The Cat', 'Boom Bap / Old school', 90, 'Bb major', '3:58', '/placeholder.svg?height=400&width=400&text=Golden+Era', 'https://beatstars.com/catmatildabeat', 15, 'active', 'latest'),
('Synthwave Retro', 'Matilda The Cat', 'Synthwave', 120, 'C# minor', '4:15', '/placeholder.svg?height=400&width=400&text=Synthwave+Retro', 'https://beatstars.com/catmatildabeat', 22, 'active', 'latest'),
('Gospel Glow', 'Matilda The Cat', 'Cinematic Emotional', 140, 'G minor', '3:42', '/placeholder.svg?height=400&width=400&text=Gospel+Glow', 'https://beatstars.com/catmatildabeat', 31, 'active', 'latest'),
('Boom Bap Classic', 'Matilda The Cat', 'Boom Bap / Old school', 95, 'D minor', '3:18', '/placeholder.svg?height=400&width=400&text=Boom+Bap+Classic', 'https://beatstars.com/catmatildabeat', 26, 'active', 'latest'),
('Indie Breeze', 'Matilda The Cat', 'Indie', 95, 'E major', '3:35', '/placeholder.svg?height=400&width=400&text=Indie+Breeze', 'https://beatstars.com/catmatildabeat', 41, 'active', 'latest');
