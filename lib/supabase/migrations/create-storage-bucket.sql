-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-files',
  'chat-files',
  true,
  10485760, -- 10MB in bytes
  ARRAY[
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/webm',
    'audio/ogg',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
);

-- Create policy for authenticated users to upload files
CREATE POLICY "Users can upload chat files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'chat-files' AND
  auth.role() = 'authenticated'
);

-- Create policy for authenticated users to view files
CREATE POLICY "Users can view chat files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'chat-files' AND
  auth.role() = 'authenticated'
);

-- Create policy for users to delete their own files
CREATE POLICY "Users can delete their own chat files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'chat-files' AND
  auth.role() = 'authenticated' AND
  owner = auth.uid()
);

-- Create policy for users to update their own files
CREATE POLICY "Users can update their own chat files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'chat-files' AND
  auth.role() = 'authenticated' AND
  owner = auth.uid()
); 