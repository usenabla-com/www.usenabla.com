-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  support_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'assigned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'support')),
  message TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS chat_rooms_user_id_idx ON chat_rooms(user_id);
CREATE INDEX IF NOT EXISTS chat_rooms_status_idx ON chat_rooms(status);
CREATE INDEX IF NOT EXISTS chat_rooms_last_message_at_idx ON chat_rooms(last_message_at);
CREATE INDEX IF NOT EXISTS chat_messages_chat_room_id_idx ON chat_messages(chat_room_id);
CREATE INDEX IF NOT EXISTS chat_messages_sender_id_idx ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat_rooms
CREATE POLICY "Users can view their own chat rooms" ON chat_rooms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat rooms" ON chat_rooms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat rooms" ON chat_rooms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Support agents can view all chat rooms" ON chat_rooms
  FOR ALL USING (auth.uid() = 'ec241bb3-293e-4f03-9d07-591f0208d0ad'::uuid);

-- Create RLS policies for chat_messages
CREATE POLICY "Users can view messages in their chat rooms" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE chat_rooms.id = chat_messages.chat_room_id 
      AND chat_rooms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their chat rooms" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE chat_rooms.id = chat_messages.chat_room_id 
      AND chat_rooms.user_id = auth.uid()
    )
  );

CREATE POLICY "Support agents can view all messages" ON chat_messages
  FOR SELECT USING (auth.uid() = 'ec241bb3-293e-4f03-9d07-591f0208d0ad'::uuid);

CREATE POLICY "Support agents can create messages" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = 'ec241bb3-293e-4f03-9d07-591f0208d0ad'::uuid AND
    sender_id = auth.uid() AND
    sender_type = 'support'
  );

CREATE POLICY "Support agents can update messages" ON chat_messages
  FOR UPDATE USING (auth.uid() = 'ec241bb3-293e-4f03-9d07-591f0208d0ad'::uuid); 