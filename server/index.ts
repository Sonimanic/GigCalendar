import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const port = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: '*',  // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

const DATA_DIR = join(__dirname, '../data');
const GIGS_FILE = join(DATA_DIR, 'gigs.json');
const COMMITMENTS_FILE = join(DATA_DIR, 'commitments.json');
const MEMBERS_FILE = join(DATA_DIR, 'members.json');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!existsSync(GIGS_FILE)) {
  writeFileSync(GIGS_FILE, JSON.stringify({ gigs: [] }));
}

if (!existsSync(COMMITMENTS_FILE)) {
  writeFileSync(COMMITMENTS_FILE, JSON.stringify({ commitments: [] }));
}

if (!existsSync(MEMBERS_FILE)) {
  writeFileSync(MEMBERS_FILE, JSON.stringify({ members: [] }));
}

// Read data files
const readGigs = () => {
  try {
    return JSON.parse(readFileSync(GIGS_FILE, 'utf-8'));
  } catch (error) {
    console.error('Error reading gigs file:', error);
    return { gigs: [] };
  }
};

const readMembers = () => {
  try {
    return JSON.parse(readFileSync(MEMBERS_FILE, 'utf-8'));
  } catch (error) {
    console.error('Error reading members file:', error);
    return { members: [] };
  }
};

const readCommitments = () => {
  try {
    return JSON.parse(readFileSync(COMMITMENTS_FILE, 'utf-8'));
  } catch (error) {
    console.error('Error reading commitments file:', error);
    return { commitments: [] };
  }
};

// Write data files
const writeGigs = (data: any) => {
  try {
    writeFileSync(GIGS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing gigs file:', error);
    throw error;
  }
};

const writeMembers = (data: any) => {
  try {
    writeFileSync(MEMBERS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing members file:', error);
    throw error;
  }
};

const writeCommitments = (data: any) => {
  try {
    writeFileSync(COMMITMENTS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing commitments file:', error);
    throw error;
  }
};

// Emit updates to all connected clients
const emitUpdate = (type: string, data: any) => {
  io.emit('dataUpdate', { type, data });
};

// Gigs endpoints
app.get('/api/gigs', (_, res) => {
  try {
    const data = readGigs();
    res.json(data.gigs);
  } catch (error) {
    console.error('Error reading gigs:', error);
    res.status(500).json({ error: 'Failed to read gigs' });
  }
});

app.post('/api/gigs', async (req, res) => {
  try {
    const newGig = {
      ...req.body,
      assignedMembers: req.body.assignedMembers || [] // Ensure assignedMembers is initialized
    };
    
    const gigs = readGigs();
    gigs.gigs.push(newGig);
    writeGigs(gigs);
    
    // Notify clients about the update
    io.emit('dataUpdate', { type: 'gigs', data: gigs.gigs });
    
    res.status(201).json(newGig);
  } catch (error) {
    console.error('Failed to create gig:', error);
    res.status(500).json({ error: 'Failed to create gig' });
  }
});

app.put('/api/gigs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGig = req.body;
    
    // Ensure assignedMembers is an array
    if (!Array.isArray(updatedGig.assignedMembers)) {
      updatedGig.assignedMembers = [];
    }

    const gigs = readGigs();
    const gigIndex = gigs.gigs.findIndex(g => g.id === id);
    
    if (gigIndex === -1) {
      return res.status(404).json({ error: 'Gig not found' });
    }
    
    gigs.gigs[gigIndex] = { ...gigs.gigs[gigIndex], ...updatedGig };
    writeGigs(gigs);
    
    // Notify clients about the update
    io.emit('dataUpdate', { type: 'gigs', data: gigs.gigs });
    
    res.json(gigs.gigs[gigIndex]);
  } catch (error) {
    console.error('Failed to update gig:', error);
    res.status(500).json({ error: 'Failed to update gig' });
  }
});

app.delete('/api/gigs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = readGigs();
    data.gigs = data.gigs.filter(gig => gig.id !== id);
    writeGigs(data);
    emitUpdate('gigs', data.gigs);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting gig:', error);
    res.status(500).json({ error: 'Failed to delete gig' });
  }
});

// Member endpoints
app.get('/api/members', (_, res) => {
  try {
    const data = readMembers();
    res.json(data.members);
  } catch (error) {
    console.error('Failed to read members:', error);
    res.status(500).json({ error: 'Failed to read members' });
  }
});

app.post('/api/members', (req, res) => {
  try {
    const newMember = req.body;
    console.log('Received new member:', newMember);
    const data = readMembers();
    console.log('Current members:', data);
    if (!Array.isArray(data.members)) {
      data.members = [];
    }
    data.members.push(newMember);
    console.log('Updated members:', data);
    writeMembers(data);
    emitUpdate('members', data.members);  // Emit update
    res.json(newMember);
  } catch (error) {
    console.error('Failed to add member:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

app.put('/api/members/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updatedMember = req.body;
    const data = readMembers();
    data.members = data.members.map((member: any) => member.id === id ? updatedMember : member);
    writeMembers(data);
    res.json(updatedMember);
  } catch (error) {
    console.error('Failed to update member:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

app.delete('/api/members/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete member:', id);
    const data = readMembers();
    console.log('Current members:', data);
    
    // Don't allow deleting the last admin
    const remainingAdmins = data.members.filter((member: any) => 
      member.role === 'admin' && member.id !== id
    ).length;
    
    if (remainingAdmins === 0) {
      console.log('Cannot delete last admin');
      return res.status(400).json({ error: 'Cannot delete the last admin' });
    }

    const initialLength = data.members.length;
    data.members = data.members.filter((member: any) => member.id !== id);
    
    if (data.members.length === initialLength) {
      console.log('Member not found:', id);
      return res.status(404).json({ error: 'Member not found' });
    }

    console.log('Updated members:', data);
    writeMembers(data);
    emitUpdate('members', data.members);  // Emit update
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Failed to delete member:', error);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

// Commitments endpoints
app.get('/api/commitments', (_, res) => {
  try {
    const data = readCommitments();
    res.json(data.commitments);
  } catch (error) {
    console.error('Failed to read commitments:', error);
    res.status(500).json({ error: 'Failed to read commitments' });
  }
});

app.post('/api/commitments', (req, res) => {
  try {
    const newCommitments = req.body;
    const data = { commitments: newCommitments };
    writeCommitments(data);
    res.json(newCommitments);
  } catch (error) {
    console.error('Failed to update commitments:', error);
    res.status(500).json({ error: 'Failed to update commitments' });
  }
});

// Handle React Router routes
app.get('*', (_, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Update the server startup
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Local: http://localhost:${port}`);
  console.log(`Network: http://192.168.1.140:${port}`);
});